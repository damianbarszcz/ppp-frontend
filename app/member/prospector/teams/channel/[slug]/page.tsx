"use client";
import {useAuth} from "@/app/context/AuthContext";
import {useEffect, useRef, useState} from "react";
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
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

    const rtcConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    useEffect(() => {
        if (!user?.id || !singleTeam?.id) return;

        socketRef.current = io(`${API_CONFIG.baseUrl.replace('/api', '')}/channel`, {
            transports: ['websocket', 'polling']
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
            // Join channel
            socket.emit('join-channel', {
                teamId: singleTeam.id,
                userId: user.id
            });
        });

        socket.on('user-joined', (data) => {
            console.log('User joined:', data.userId);
        });

        socket.on('user-left', (data) => {
            console.log('User left:', data.userId);
            // Remove peer connection and stream
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
        });

        socket.on('participants-updated', (participants) => {
            getActiveParticipants(participants.users);
            setParticipantsCount(participants.count);
        });

        // WebRTC Signaling events
        socket.on('offer', async (data) => {
            await handleOffer(data.fromUserId, data.offer);
        });

        socket.on('answer', async (data) => {
            await handleAnswer(data.fromUserId, data.answer);
        });

        socket.on('ice-candidate', async (data) => {
            await handleIceCandidate(data.fromUserId, data.candidate);
        });

        // Heartbeat to keep connection alive
        const heartbeatInterval = setInterval(() => {
            if (socket.connected) {
                socket.emit('heartbeat');
            }
        }, 30000);

        return () => {
            clearInterval(heartbeatInterval);
            socket.emit('leave-channel');
            socket.disconnect();

            // Close all peer connections
            peerConnectionsRef.current.forEach(pc => pc.close());
            peerConnectionsRef.current.clear();
        };
    }, [user?.id, singleTeam?.id]);

    // Create peer connection for new user
    const createPeerConnection = (userId: number) => {
        const peerConnection = new RTCPeerConnection(rtcConfig);

        // Add local stream to peer connection
        if (localStream) {
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
        }

        // Handle remote stream
        peerConnection.ontrack = (event) => {
            const [remoteStream] = event.streams;
            setStreams(prev => new Map(prev.set(userId, remoteStream)));
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                socketRef.current.emit('ice-candidate', {
                    targetUserId: userId,
                    candidate: event.candidate
                });
            }
        };

        peerConnectionsRef.current.set(userId, peerConnection);
        return peerConnection;
    };

    // Handle incoming offer
    const handleOffer = async (fromUserId: number, offer: RTCSessionDescriptionInit) => {
        const peerConnection = createPeerConnection(fromUserId);

        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            if (socketRef.current) {
                socketRef.current.emit('answer', {
                    targetUserId: fromUserId,
                    answer: answer
                });
            }
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    };

    // Handle incoming answer
    const handleAnswer = async (fromUserId: number, answer: RTCSessionDescriptionInit) => {
        const peerConnection = peerConnectionsRef.current.get(fromUserId);
        if (peerConnection) {
            try {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (error) {
                console.error('Error handling answer:', error);
            }
        }
    };

    // Handle incoming ICE candidate
    const handleIceCandidate = async (fromUserId: number, candidate: RTCIceCandidateInit) => {
        const peerConnection = peerConnectionsRef.current.get(fromUserId);
        if (peerConnection) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error('Error handling ICE candidate:', error);
            }
        }
    };

    // Create offers for all existing users when local stream changes
    const createOffersForAllUsers = async () => {
        if (!localStream || !socketRef.current) return;

        activeParticipants.forEach(async (participant) => {
            if (participant.id !== user?.id) {
                const peerConnection = createPeerConnection(participant.id);

                try {
                    const offer = await peerConnection.createOffer();
                    await peerConnection.setLocalDescription(offer);

                    socketRef.current?.emit('offer', {
                        targetUserId: participant.id,
                        offer: offer
                    });
                } catch (error) {
                    console.error('Error creating offer:', error);
                }
            }
        });
    };

    useEffect(() => {
        const fetchSingleTeam = async () : Promise<void> => {
            try {
                const response =  await axios.get(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.team.fetchSingleTeam + teamUrl}`);
                if (response.data.success) {
                    setSingleTeam(response.data.data);
                }
            } catch (error) {
                console.error("Błąd przy pobieraniu danych dla kanału", error);
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
                console.error("Błąd przy pobieraniu wiadomości:", error);
            }
        }
        fetchMessages();

        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);

    }, [singleTeam?.id]);

    const setupSpeakingDetection = (stream: MediaStream) => {
        try {
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

        // Cleanup WebSocket and WebRTC
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

        if (!newMutedState) {
            if (!localStream && !audioStream) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: false
                    });
                    setAudioStream(stream);
                    setupSpeakingDetection(stream);
                    console.log('Audio stream utworzony dla mikrofonu');
                } catch (error) {
                    console.error('Błąd dostępu do mikrofonu:', error);
                    alert('Nie można uzyskać dostępu do mikrofonu.');
                    return;
                }
            } else if (localStream) {
                const audioTrack = localStream.getAudioTracks()[0];
                if (audioTrack) {
                    audioTrack.enabled = true;
                }
                cleanupSpeakingDetection();
                setupSpeakingDetection(localStream);
            } else if (audioStream) {
                cleanupSpeakingDetection();
                setupSpeakingDetection(audioStream);
            }
        } else {
            cleanupSpeakingDetection();
            setIsSpeaking(false);

            if (localStream) {
                const audioTrack = localStream.getAudioTracks()[0];
                if (audioTrack) {
                    audioTrack.enabled = false;
                }
            } else if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
                setAudioStream(null);
            }
        }

        setIsMuted(newMutedState);
    };

    const handleToggleVideo = async (): Promise<void> => {
        if (isVideoOn) {
            if (localStream) {
                localStream.getTracks().forEach(track => {
                    track.stop();
                });
                setLocalStream(null);
            }

            if (!isMuted) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: false
                    });
                    setAudioStream(stream);
                    setupSpeakingDetection(stream);
                    console.log('Przełączono na audio-only stream');
                } catch (error) {
                    console.error('Błąd dostępu do audio:', error);
                }
            } else {
                cleanupSpeakingDetection();
            }

            setIsVideoOn(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: 'user'
                    },
                    audio: true
                });

                if (audioStream) {
                    cleanupSpeakingDetection();
                    audioStream.getTracks().forEach(track => track.stop());
                    setAudioStream(null);
                }

                setLocalStream(stream);
                setIsVideoOn(true);
                streamRef.current = stream;

                setupSpeakingDetection(stream);

                // Create offers for all existing users
                await createOffersForAllUsers();

                console.log('Kamera włączona z audio');
            } catch (error) {
                console.error('Błąd dostępu do kamery:', error);
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

    // Cleanup on component unmount
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (socketRef.current) {
                socketRef.current.emit('leave-channel');
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            cleanupSpeakingDetection();
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
            }
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            peerConnectionsRef.current.forEach(pc => pc.close());
        };
    }, [localStream, audioStream]);

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