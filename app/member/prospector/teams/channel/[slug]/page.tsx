"use client";
import {useAuth} from "@/app/context/AuthContext";
import {useEffect, useRef, useState, useCallback} from "react";
import {useParams, useRouter} from "next/navigation";
import {API_CONFIG} from "@/app/config/global";
import axios from "axios";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import ActionsPanel from "../ActionPanel";
import ParticipantsPanel from "../ParticipantsPanel";
import ChatPanel from "../ChatPanel";
import {Team, ChannelMessage, ActiveParticipant} from "@/app/types";
import io, { Socket } from "socket.io-client";

export default function SingleChannelPage() {
    const {user, logout} = useAuth();
    const router = useRouter();
    const streamRef = useRef<MediaStream | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const peerConnectionsRef = useRef<Map<number, RTCPeerConnection>>(new Map());
    const [accountDropdownOpen,setAccountDropdownOpen] = useState(false);
    const params = useParams();
    const teamUrl = decodeURIComponent(params.slug as string);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [singleTeam, setSingleTeam] = useState<Team>();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChannelMessage[]>([]);
    const [activeParticipants, getActiveParticipants] = useState<ActiveParticipant[]>([]);
    const [isMuted, setIsMuted] = useState(true);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [activeView, setActiveView] = useState<'chat' | 'participants'>('chat');
    const [participantsCount, setParticipantsCount] = useState(0);
    const [streams, setStreams] = useState<Map<number, MediaStream>>(new Map());
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [connectionStates, setConnectionStates] = useState<Map<number, RTCPeerConnectionState>>(new Map());
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);

    const rtcConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    const updatePeerConnectionsWithStream = useCallback((stream: MediaStream | null) => {
        peerConnectionsRef.current.forEach((pc, userId) => {
            if (stream) {
                const senders = pc.getSenders();
                senders.forEach(sender => {
                    if (sender.track) {
                        pc.removeTrack(sender);
                    }
                });
                stream.getTracks().forEach(track => {
                    console.log(`Adding ${track.kind} track to peer ${userId}`);
                    pc.addTrack(track, stream);
                });
            } else {
                const senders = pc.getSenders();
                senders.forEach(sender => {
                    if (sender.track) {
                        pc.removeTrack(sender);
                    }
                });
            }
        });

        peerConnectionsRef.current.forEach(async (pc, userId) => {
            if (pc.connectionState === 'connected') {
                try {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);

                    if (socketRef.current) {
                        socketRef.current.emit('offer', {
                            targetUserId: userId,
                            offer: offer
                        });
                    }
                } catch (error) {
                    console.error(`Error renegotiating with user ${userId}:`, error);
                }
            }
        });
    }, []);

    const createPeerConnection = useCallback((userId: number) => {
        const existingConnection = peerConnectionsRef.current.get(userId);
        if (existingConnection &&
            (existingConnection.connectionState === 'connected' ||
                existingConnection.connectionState === 'connecting')) {
            return existingConnection;
        }
        if (existingConnection) {
            existingConnection.close();
        }

        const peerConnection = new RTCPeerConnection(rtcConfig);
        if (localStream) {
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
        }
        peerConnection.ontrack = (event) => {
            const [remoteStream] = event.streams;

            if (remoteStream && remoteStream.getTracks().length > 0) {
                setStreams(prev => {
                    const newStreams = new Map(prev);
                    newStreams.set(userId, remoteStream);
                    return newStreams;
                });
            }
        };
        peerConnection.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                socketRef.current.emit('ice-candidate', {
                    targetUserId: userId,
                    candidate: event.candidate
                });
            }
        };

        peerConnection.onconnectionstatechange = () => {
            const state = peerConnection.connectionState;
            setConnectionStates(prev => {
                const newStates = new Map(prev);
                newStates.set(userId, state);
                return newStates;
            });

            if (state === 'failed') {
                setTimeout(() => {
                    if (socketRef.current && activeParticipants.some(p => p.id === userId)) {
                        initiateConnectionWithUser(userId);
                    }
                }, 2000);
            }
        };

        peerConnection.oniceconnectionstatechange = () => {
            console.log(`ICE connection state for user ${userId}:`, peerConnection.iceConnectionState);
        };

        peerConnectionsRef.current.set(userId, peerConnection);
        return peerConnection;
    }, [localStream, activeParticipants]);

    const initiateConnectionWithUser = useCallback(async (userId: number) => {
        if (!socketRef.current) return;
        const peerConnection = createPeerConnection(userId);

        try {
            const offer = await peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });

            await peerConnection.setLocalDescription(offer);
            socketRef.current.emit('offer', {
                targetUserId: userId,
                offer: offer
            });
        } catch (error) {
            console.error(`Error creating offer for user ${userId}:`, error);
        }
    }, [createPeerConnection]);

    const handleOffer = useCallback(async (data: {fromUserId: number, offer: RTCSessionDescriptionInit}) => {
        if (!data.offer || !data.offer.type || !data.offer.sdp) {
            return;
        }
        const peerConnection = createPeerConnection(data.fromUserId);
        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            if (socketRef.current) {
                socketRef.current.emit('answer', {
                    targetUserId: data.fromUserId,
                    answer: answer
                });
            }
        } catch (error) {
            console.error(error);
        }
    }, [createPeerConnection]);

    const handleAnswer = useCallback(async (data: {fromUserId: number, answer: RTCSessionDescriptionInit}) => {
        const peerConnection = peerConnectionsRef.current.get(data.fromUserId);
        if (peerConnection) {
            try {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            } catch (error) {
                console.error(error);
            }
        }
    }, []);

    const handleIceCandidate = useCallback(async (data: {fromUserId: number, candidate: RTCIceCandidateInit}) => {
        const peerConnection = peerConnectionsRef.current.get(data.fromUserId);
        if (peerConnection) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (error) {
                console.error( error);
            }
        }
    }, []);

    useEffect(() => {
        if (!user?.id || !singleTeam?.id) return;
        if (socketRef.current?.connected) {
            return;
        }
        const socket = io(`${API_CONFIG.baseUrl.replace('/api', '')}/channel`, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
            socket.emit('join-channel', {
                teamId: singleTeam.id,
                userId: user.id
            });
        });

        socket.on('user-joined', (data) => {
            console.log('User joined:', data.userId);
            if (localStream && data.userId !== user.id) {
                setTimeout(() => {
                    initiateConnectionWithUser(data.userId);
                }, 1000);
            }
        });

        socket.on('user-left', (data) => {
            console.log('User left:', data.userId);
            const peerConnection = peerConnectionsRef.current.get(data.userId);
            if (peerConnection) {
                peerConnection.close();
                peerConnectionsRef.current.delete(data.userId);
            }
            setStreams(prev => {
                const newStreams = new Map(prev);
                newStreams.delete(data.userId);
                return newStreams;
            });
            setConnectionStates(prev => {
                const newStates = new Map(prev);
                newStates.delete(data.userId);
                return newStates;
            });
        });

        socket.on('participants-updated', (participants) => {
            console.log('Participants updated:', participants);
            getActiveParticipants(participants.users);
            setParticipantsCount(participants.count);
        });

        socket.on('offer', handleOffer);
        socket.on('answer', handleAnswer);
        socket.on('ice-candidate', handleIceCandidate);

        const heartbeatInterval = setInterval(() => {
            if (socket.connected) {
                socket.emit('heartbeat');
            }
        }, 30000);

        return () => {
            clearInterval(heartbeatInterval);
            socket.emit('leave-channel');
            socket.disconnect();
            socketRef.current = null;
            peerConnectionsRef.current.forEach(pc => pc.close());
            peerConnectionsRef.current.clear();
        };
    }, [user?.id, singleTeam?.id]);

    useEffect(() => {
        if (localStream && socketRef.current?.connected) {
            updatePeerConnectionsWithStream(localStream);

            socketRef.current.emit('user-stream-state-changed', {
                hasVideo: isVideoOn,
                hasAudio: !isMuted
            });
            const otherParticipants = activeParticipants.filter(p => p.id !== user?.id);
            otherParticipants.forEach(participant => {
                if (!peerConnectionsRef.current.has(participant.id)) {
                    initiateConnectionWithUser(participant.id);
                }
            });
        }
    }, [localStream, isVideoOn, isMuted, activeParticipants, user?.id, updatePeerConnectionsWithStream, initiateConnectionWithUser]);

    useEffect(() => {
        const fetchSingleTeam = async () : Promise<void> => {
            try {
                const response =  await axios.get(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.team.fetchSingleTeam + teamUrl}`);
                if (response.data.success) {
                    setSingleTeam(response.data.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchSingleTeam();
    }, [teamUrl]);

    useEffect(() => {
        const fetchMessages = async () : Promise<void> => {
            if (!singleTeam?.id) return;

            try {
                const response =  await axios.get(`
                ${API_CONFIG.baseUrl}${API_CONFIG.endpoints.channel.fetchTeamMessages + singleTeam.id}`);

                if (response.data.success) {
                    setMessages(response.data.data);
                }
            } catch (error) {
                console.error( error);
            }
        }
        fetchMessages();

        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);

    }, [singleTeam?.id]);

    const setupSpeakingDetection = (stream: MediaStream) => {
        try {
            const audioTracks = stream.getAudioTracks();
            if (audioTracks.length === 0) {
                return;
            }
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyzer = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);

            analyzer.fftSize = 256;
            analyzer.smoothingTimeConstant = 0.8;
            microphone.connect(analyzer);
            audioContextRef.current = audioContext;
            analyzerRef.current = analyzer;

            const dataArray = new Uint8Array(analyzer.frequencyBinCount);
            const SPEAKING_THRESHOLD = 25;
            let speakingCount = 0;
            const SPEAKING_FRAMES = 3;

            const detectSpeaking = () => {
                if (!analyzerRef.current || isMuted) {
                    setIsSpeaking(false);
                    speakingCount = 0;
                    animationRef.current = requestAnimationFrame(detectSpeaking);
                    return;
                }
                analyzer.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

                if (average > SPEAKING_THRESHOLD) {
                    speakingCount++;
                    if (speakingCount >= SPEAKING_FRAMES) {
                        setIsSpeaking(true);
                    }
                } else {
                    speakingCount = Math.max(0, speakingCount - 1);
                    if (speakingCount === 0) {
                        setIsSpeaking(false);
                    }
                }
                animationRef.current = requestAnimationFrame(detectSpeaking);
            };

            detectSpeaking();

        } catch (error) {
            console.error('Błąd setupu speaking detection:', error);
        }
    };

    const cleanupSpeakingDetection = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        analyzerRef.current = null;
        setIsSpeaking(false);
    };

    const handleLeaveChannel = () : void => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }

        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }

        if (socketRef.current) {
            socketRef.current.emit('leave-channel');
            socketRef.current.disconnect();
        }

        peerConnectionsRef.current.forEach(pc => pc.close());
        peerConnectionsRef.current.clear();

        router.push('/member/prospector/teams');
    };

    const sendMessage = async (e: React.FormEvent):Promise<void>  => {
        e.preventDefault();

        if (!message.trim() || !singleTeam?.id || !user?.id) {
            return;
        }
        try {
            const response = await axios.post(`
            ${API_CONFIG.baseUrl}${API_CONFIG.endpoints.channel.sendMessage + singleTeam.id + '/' + user.id}`, {
                content: message.trim()
            });

            if (response.data.success) {
                setMessage("");
                setMessages(prev => [...prev, response.data.data]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleToggleMute = async (): Promise<void> => {
        const newMutedState = !isMuted;

        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !newMutedState;

                if (!newMutedState && !analyzerRef.current) {
                    setupSpeakingDetection(localStream);
                } else if (newMutedState) {
                    cleanupSpeakingDetection();
                }
            }
        }

        setIsMuted(newMutedState);
        if (socketRef.current) {
            socketRef.current.emit('user-stream-state-changed', {
                hasVideo: isVideoOn,
                hasAudio: !newMutedState
            });
        }
    };

    const handleToggleVideo = async (): Promise<void> => {
        if (isVideoOn) {
            if (localStream) {
                localStream.getVideoTracks().forEach(track => {
                    track.stop();
                    localStream.removeTrack(track);
                });
                if (localStream.getTracks().length === 0) {
                    setLocalStream(null);
                    streamRef.current = null;
                    cleanupSpeakingDetection();
                }
            }

            setIsVideoOn(false);
            if (socketRef.current) {
                socketRef.current.emit('user-stream-state-changed', {
                    hasVideo: false,
                    hasAudio: !isMuted
                });
            }

        } else {
            try {
                const constraints = {
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: 'user'
                    },
                    audio: true
                };

                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                const audioTrack = stream.getAudioTracks()[0];
                if (audioTrack) {
                    audioTrack.enabled = !isMuted;
                }

                setLocalStream(stream);
                setIsVideoOn(true);
                streamRef.current = stream;
                if (!isMuted) {
                    setupSpeakingDetection(stream);
                }
            } catch (error) {
                alert('Nie można uzyskać dostępu do kamery. Sprawdź uprawnienia.');
            }
        }
    };

    const handleChatMessages = (): void => {
        setActiveView('chat');
    };

    const handleParticipantsList = (): void => {
        setActiveView('participants');
    };

    useEffect(() => {
        if (!isMuted && localStream && !analyzerRef.current) {
            setupSpeakingDetection(localStream);
        } else if (isMuted) {
            setIsSpeaking(false);
        }
    }, [isMuted, localStream]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (socketRef.current) {
                socketRef.current.emit('leave-channel');
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            console.log('Component unmounting - cleaning up');
            cleanupSpeakingDetection();

            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }

            if (socketRef.current) {
                socketRef.current.emit('leave-channel');
                socketRef.current.disconnect();
            }

            peerConnectionsRef.current.forEach(pc => pc.close());
        };
    }, []);

    return (
        <ProtectedRoute>
            <Navigation
                activeSection=""
                user={user!}
                handleLogout={logout}
                accountDropdownOpen = {accountDropdownOpen}
                setAccountDropdownOpen={setAccountDropdownOpen}
                notifyDropdownOpen = {notifyDropdownOpen}
                setNotifyDropdownOpen={setNotifyDropdownOpen}
                type="channel"
                team={singleTeam!}
            />

            <main className="h-full pt-3 pr-10 pl-10">
                <div className="grid grid-cols-12 grid-rows-4 gap-x-20 gap-y-10 h-full max-h-[90%]">
                    <ParticipantsPanel
                        activeParticipants={activeParticipants}
                        participantsCount={participantsCount}
                        localStream={localStream}
                        streams={streams}
                        isVideoOn={isVideoOn}
                        isMuted={isMuted}
                        isSpeaking={isSpeaking}
                    />
                    <ChatPanel
                        messages={messages}
                        sendMessage={sendMessage}
                        message={message}
                        handleChatMessages={handleChatMessages}
                        handleParticipantsList={handleParticipantsList}
                        participantsCount={ participantsCount}
                        activeParticipants = {activeParticipants}
                        activeView={activeView}
                        setMessage={setMessage}
                    />

                    <ActionsPanel
                        handleLeaveChannel= { handleLeaveChannel }
                        handleToggleMute = { handleToggleMute }
                        handleToggleVideo = { handleToggleVideo }
                        isMuted={isMuted}
                        isVideoOn={isVideoOn}
                    />
                </div>
            </main>
        </ProtectedRoute>
    );
}