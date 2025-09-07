"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_CONFIG } from "@/app/config/global";
import axios from "axios";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import ActionsPanel from "../ActionPanel";
import ParticipantsPanel from "../ParticipantsPanel";
import ChatPanel from "../ChatPanel";
import { Team, ChannelMessage, ActiveParticipant } from "@/app/types";
import io, { Socket } from "socket.io-client";

export default function SingleChannelPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const params = useParams();
    const teamUrl = decodeURIComponent(params.slug as string);

    // Socket and WebRTC refs
    const socketRef = useRef<Socket | null>(null);
    const peerConnectionsRef = useRef<Map<number, RTCPeerConnection>>(new Map());
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);

    // State
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
    const [singleTeam, setSingleTeam] = useState<Team>();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChannelMessage[]>([]);
    const [activeParticipants, setActiveParticipants] = useState<ActiveParticipant[]>([]);
    const [participantsCount, setParticipantsCount] = useState(0);
    const [activeView, setActiveView] = useState<'chat' | 'participants'>('chat');

    // Media state
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [streams, setStreams] = useState<Map<number, MediaStream>>(new Map());
    const [isMuted, setIsMuted] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const rtcConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    // WebRTC Functions
    const createPeerConnection = useCallback((userId: number) => {
        const existingConnection = peerConnectionsRef.current.get(userId);
        if (existingConnection?.connectionState === 'connected' ||
            existingConnection?.connectionState === 'connecting') {
            return existingConnection;
        }

        existingConnection?.close();

        const peerConnection = new RTCPeerConnection(rtcConfig);

        // Add local stream tracks
        if (localStream) {
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
        }

        // Handle remote stream
        peerConnection.ontrack = (event) => {
            const [remoteStream] = event.streams;
            if (remoteStream?.getTracks().length > 0) {
                setStreams(prev => new Map(prev).set(userId, remoteStream));
            }
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

        // Handle connection state changes
        peerConnection.onconnectionstatechange = () => {
            if (peerConnection.connectionState === 'failed') {
                setTimeout(() => {
                    if (socketRef.current && activeParticipants.some(p => p.id === userId)) {
                        initiateConnectionWithUser(userId);
                    }
                }, 2000);
            }
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
            socketRef.current.emit('offer', { targetUserId: userId, offer });
        } catch (error) {
            console.error(`Error creating offer for user ${userId}:`, error);
        }
    }, [createPeerConnection]);

    const handleOffer = useCallback(async (data: { fromUserId: number, offer: RTCSessionDescriptionInit }) => {
        if (!data.offer?.type || !data.offer?.sdp) return;

        const peerConnection = createPeerConnection(data.fromUserId);
        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            socketRef.current?.emit('answer', {
                targetUserId: data.fromUserId,
                answer
            });
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }, [createPeerConnection]);

    const handleAnswer = useCallback(async (data: { fromUserId: number, answer: RTCSessionDescriptionInit }) => {
        const peerConnection = peerConnectionsRef.current.get(data.fromUserId);
        if (peerConnection) {
            try {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            } catch (error) {
                console.error('Error handling answer:', error);
            }
        }
    }, []);

    const handleIceCandidate = useCallback(async (data: { fromUserId: number, candidate: RTCIceCandidateInit }) => {
        const peerConnection = peerConnectionsRef.current.get(data.fromUserId);
        if (peerConnection) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (error) {
                console.error('Error handling ICE candidate:', error);
            }
        }
    }, []);

    // Audio Detection Functions
    const setupSpeakingDetection = useCallback((stream: MediaStream) => {
        try {
            const audioTracks = stream.getAudioTracks();
            if (audioTracks.length === 0) return;

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
            console.error('Speaking detection setup error:', error);
        }
    }, [isMuted]);

    const cleanupSpeakingDetection = useCallback(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        if (audioContextRef.current?.state !== 'closed') {
            audioContextRef.current?.close();
            audioContextRef.current = null;
        }
        analyzerRef.current = null;
        setIsSpeaking(false);
    }, []);

    // Media Control Functions
    const handleToggleVideo = useCallback(async () => {
        if (isVideoOn) {
            // Turn off video
            if (localStream) {
                localStream.getVideoTracks().forEach(track => {
                    track.stop();
                    localStream.removeTrack(track);
                });
                // If no audio tracks left, clean up completely
                if (localStream.getTracks().length === 0) {
                    setLocalStream(null);
                    cleanupSpeakingDetection();
                }
            }
            setIsVideoOn(false);
        } else {
            // Turn on video
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

                if (!isMuted) {
                    setupSpeakingDetection(stream);
                }
            } catch (error) {
                console.error('Camera access error:', error);
                alert('Nie można uzyskać dostępu do kamery. Sprawdź uprawnienia.');
            }
        }

        // Notify other users about stream state change
        socketRef.current?.emit('user-stream-state-changed', {
            hasVideo: !isVideoOn,
            hasAudio: !isMuted
        });
    }, [isVideoOn, isMuted, localStream, setupSpeakingDetection, cleanupSpeakingDetection]);

    const handleToggleMute = useCallback(() => {
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

        socketRef.current?.emit('user-stream-state-changed', {
            hasVideo: isVideoOn,
            hasAudio: !newMutedState
        });
    }, [isMuted, localStream, isVideoOn, setupSpeakingDetection, cleanupSpeakingDetection]);

    // Socket Connection Effect
    useEffect(() => {
        if (!user?.id || !singleTeam?.id || socketRef.current?.connected) return;

        const socket = io(`${API_CONFIG.baseUrl.replace('/api', '')}/channel`, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join-channel', {
                teamId: singleTeam.id,
                userId: user.id
            });
        });

        socket.on('user-joined', (data) => {
            if (localStream && data.userId !== user.id) {
                setTimeout(() => initiateConnectionWithUser(data.userId), 1000);
            }
        });

        socket.on('user-left', (data) => {
            const peerConnection = peerConnectionsRef.current.get(data.userId);
            peerConnection?.close();
            peerConnectionsRef.current.delete(data.userId);

            setStreams(prev => {
                const newStreams = new Map(prev);
                newStreams.delete(data.userId);
                return newStreams;
            });
        });

        socket.on('participants-updated', (participants) => {
            setActiveParticipants(participants.users);
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
    }, [user?.id, singleTeam?.id, localStream, handleOffer, handleAnswer, handleIceCandidate, initiateConnectionWithUser]);

    // Update peer connections when stream changes
    useEffect(() => {
        if (localStream && socketRef.current?.connected) {
            // Update existing peer connections with new stream
            peerConnectionsRef.current.forEach((pc) => {
                const senders = pc.getSenders();
                senders.forEach(sender => {
                    if (sender.track) {
                        pc.removeTrack(sender);
                    }
                });
                localStream.getTracks().forEach(track => {
                    pc.addTrack(track, localStream);
                });
            });

            // Initiate connections with new participants
            activeParticipants
                .filter(p => p.id !== user?.id && !peerConnectionsRef.current.has(p.id))
                .forEach(participant => initiateConnectionWithUser(participant.id));
        }
    }, [localStream, activeParticipants, user?.id, initiateConnectionWithUser]);

    // Fetch team data
    useEffect(() => {
        const fetchSingleTeam = async () => {
            try {
                const response = await axios.get(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.team.fetchSingleTeam}${teamUrl}`
                );
                if (response.data.success) {
                    setSingleTeam(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching team data:", error);
            }
        };

        fetchSingleTeam();
    }, [teamUrl]);

    // Fetch messages
    useEffect(() => {
        if (!singleTeam?.id) return;

        const fetchMessages = async () => {
            try {
                const response = await axios.get(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.channel.fetchTeamMessages}${singleTeam.id}`
                );
                if (response.data.success) {
                    setMessages(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [singleTeam?.id]);

    // Cleanup on unmount
    useEffect(() => {
        const handleBeforeUnload = () => {
            socketRef.current?.emit('leave-channel');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            cleanupSpeakingDetection();
            localStream?.getTracks().forEach(track => track.stop());
            socketRef.current?.emit('leave-channel');
            socketRef.current?.disconnect();
            peerConnectionsRef.current.forEach(pc => pc.close());
        };
    }, [localStream, cleanupSpeakingDetection]);

    const handleLeaveChannel = useCallback(() => {
        localStream?.getTracks().forEach(track => track.stop());
        socketRef.current?.emit('leave-channel');
        socketRef.current?.disconnect();
        peerConnectionsRef.current.forEach(pc => pc.close());
        peerConnectionsRef.current.clear();
        router.push('/member/prospector/teams');
    }, [localStream, router]);

    const sendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !singleTeam?.id || !user?.id) return;

        try {
            const response = await axios.post(
                `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.channel.sendMessage}${singleTeam.id}/${user.id}`,
                { content: message.trim() }
            );

            if (response.data.success) {
                setMessage("");
                setMessages(prev => [...prev, response.data.data]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }, [message, singleTeam?.id, user?.id]);

    const handleChatMessages = useCallback(() => setActiveView('chat'), []);
    const handleParticipantsList = useCallback(() => setActiveView('participants'), []);

    return (
        <ProtectedRoute>
            <Navigation
                activeSection=""
                user={user!}
                handleLogout={logout}
                accountDropdownOpen={accountDropdownOpen}
                setAccountDropdownOpen={setAccountDropdownOpen}
                notifyDropdownOpen={notifyDropdownOpen}
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
                        participantsCount={participantsCount}
                        activeParticipants={activeParticipants}
                        activeView={activeView}
                        setMessage={setMessage}
                    />
                    <ActionsPanel
                        handleLeaveChannel={handleLeaveChannel}
                        handleToggleMute={handleToggleMute}
                        handleToggleVideo={handleToggleVideo}
                        isMuted={isMuted}
                        isVideoOn={isVideoOn}
                    />
                </div>
            </main>
        </ProtectedRoute>
    );
}