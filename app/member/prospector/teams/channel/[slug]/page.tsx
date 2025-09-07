"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
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

// Wydzielone stałe konfiguracyjne
const RTC_CONFIG = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

const MEDIA_CONSTRAINTS = {
    video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
    },
    audio: true
};

const SPEAKING_THRESHOLD = 25;
const SPEAKING_FRAMES = 3;
const HEARTBEAT_INTERVAL = 30000;
const CONNECTION_RETRY_DELAY = 2000;

export default function SingleChannelPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const params = useParams();
    const teamUrl = decodeURIComponent(params.slug as string);

    // State management - pogrupowane logicznie
    // UI State
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
    const [activeView, setActiveView] = useState<'chat' | 'participants'>('chat');

    // Team & Chat State
    const [singleTeam, setSingleTeam] = useState<Team>();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChannelMessage[]>([]);

    // Participants State
    const [activeParticipants, setActiveParticipants] = useState<ActiveParticipant[]>([]);
    const [participantsCount, setParticipantsCount] = useState(0);

    // Media State
    const [isMuted, setIsMuted] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [streams, setStreams] = useState<Map<number, MediaStream>>(new Map());

    // Refs - wszystkie w jednym miejscu
    const socketRef = useRef<Socket | null>(null);
    const peerConnectionsRef = useRef<Map<number, RTCPeerConnection>>(new Map());
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Memoizowane wartości
    const otherParticipants = useMemo(() =>
            activeParticipants.filter(p => p.id !== user?.id),
        [activeParticipants, user?.id]
    );

    // ========== WebRTC Helper Functions ==========

    const createPeerConnection = useCallback((userId: number): RTCPeerConnection => {
        // Cleanup existing connection if needed
        const existingConnection = peerConnectionsRef.current.get(userId);
        if (existingConnection?.connectionState === 'connected' ||
            existingConnection?.connectionState === 'connecting') {
            return existingConnection;
        }

        existingConnection?.close();

        const pc = new RTCPeerConnection(RTC_CONFIG);

        // Add local tracks
        if (localStream) {
            localStream.getTracks().forEach(track => {
                pc.addTrack(track, localStream);
            });
        }

        // Handle remote stream
        pc.ontrack = (event) => {
            const [remoteStream] = event.streams;
            if (remoteStream?.getTracks().length > 0) {
                setStreams(prev => new Map(prev).set(userId, remoteStream));
            }
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                socketRef.current.emit('ice-candidate', {
                    targetUserId: userId,
                    candidate: event.candidate
                });
            }
        };

        // Monitor connection state
        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'failed') {
                setTimeout(() => {
                    if (socketRef.current?.connected &&
                        activeParticipants.some(p => p.id === userId)) {
                        initiateConnectionWithUser(userId);
                    }
                }, CONNECTION_RETRY_DELAY);
            }
        };

        peerConnectionsRef.current.set(userId, pc);
        return pc;
    }, [localStream, activeParticipants]);

    const initiateConnectionWithUser = useCallback(async (userId: number) => {
        if (!socketRef.current?.connected) return;

        try {
            const pc = createPeerConnection(userId);
            const offer = await pc.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });

            await pc.setLocalDescription(offer);

            socketRef.current.emit('offer', {
                targetUserId: userId,
                offer
            });
        } catch (error) {
            console.error(`Error creating offer for user ${userId}:`, error);
        }
    }, [createPeerConnection]);

    // ========== Socket Event Handlers ==========

    const handleOffer = useCallback(async (data: {fromUserId: number, offer: RTCSessionDescriptionInit}) => {
        if (!data.offer?.type || !data.offer?.sdp) return;

        try {
            const pc = createPeerConnection(data.fromUserId);
            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socketRef.current?.emit('answer', {
                targetUserId: data.fromUserId,
                answer
            });
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }, [createPeerConnection]);

    const handleAnswer = useCallback(async (data: {fromUserId: number, answer: RTCSessionDescriptionInit}) => {
        const pc = peerConnectionsRef.current.get(data.fromUserId);
        if (pc) {
            try {
                await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
            } catch (error) {
                console.error('Error handling answer:', error);
            }
        }
    }, []);

    const handleIceCandidate = useCallback(async (data: {fromUserId: number, candidate: RTCIceCandidateInit}) => {
        const pc = peerConnectionsRef.current.get(data.fromUserId);
        if (pc) {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (error) {
                console.error('Error handling ICE candidate:', error);
            }
        }
    }, []);

    // ========== Speaking Detection ==========

    const setupSpeakingDetection = useCallback((stream: MediaStream) => {
        if (stream.getAudioTracks().length === 0) return;

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
            let speakingCount = 0;

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
            console.error('Error setting up speaking detection:', error);
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

    // ========== User Actions ==========

    const handleLeaveChannel = useCallback(() => {
        // Cleanup media
        localStream?.getTracks().forEach(track => track.stop());

        // Cleanup connections
        socketRef.current?.emit('leave-channel');
        socketRef.current?.disconnect();

        peerConnectionsRef.current.forEach(pc => pc.close());
        peerConnectionsRef.current.clear();

        cleanupSpeakingDetection();

        router.push('/member/prospector/teams');
    }, [localStream, cleanupSpeakingDetection, router]);

    const handleToggleMute = useCallback(async () => {
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

    const handleToggleVideo = useCallback(async () => {
        if (isVideoOn) {
            // Turn off camera
            if (localStream) {
                localStream.getVideoTracks().forEach(track => {
                    track.stop();
                    localStream.removeTrack(track);
                });

                if (localStream.getTracks().length === 0) {
                    setLocalStream(null);
                    cleanupSpeakingDetection();
                }
            }

            setIsVideoOn(false);

            socketRef.current?.emit('user-stream-state-changed', {
                hasVideo: false,
                hasAudio: !isMuted
            });
        } else {
            // Turn on camera
            try {
                const stream = await navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS);

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
    }, [isVideoOn, localStream, isMuted, cleanupSpeakingDetection, setupSpeakingDetection]);

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
            console.error('Error sending message:', error);
        }
    }, [message, singleTeam?.id, user?.id]);

    // ========== Effects ==========

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

    // Socket initialization
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
            const pc = peerConnectionsRef.current.get(data.userId);
            pc?.close();
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

        heartbeatIntervalRef.current = setInterval(() => {
            if (socket.connected) {
                socket.emit('heartbeat');
            }
        }, HEARTBEAT_INTERVAL);

        return () => {
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
            }
            socket.emit('leave-channel');
            socket.disconnect();
            socketRef.current = null;
            peerConnectionsRef.current.forEach(pc => pc.close());
            peerConnectionsRef.current.clear();
        };
    }, [user?.id, singleTeam?.id, handleOffer, handleAnswer, handleIceCandidate, localStream, initiateConnectionWithUser]);

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

    // Update peer connections when stream changes
    useEffect(() => {
        if (!localStream || !socketRef.current?.connected) return;

        // Update existing connections
        peerConnectionsRef.current.forEach((pc, userId) => {
            const senders = pc.getSenders();
            senders.forEach(sender => {
                if (sender.track) {
                    pc.removeTrack(sender);
                }
            });

            localStream.getTracks().forEach(track => {
                pc.addTrack(track, localStream);
            });

            // Renegotiate if connected
            if (pc.connectionState === 'connected') {
                pc.createOffer().then(offer => {
                    pc.setLocalDescription(offer);
                    socketRef.current?.emit('offer', {
                        targetUserId: userId,
                        offer
                    });
                }).catch(console.error);
            }
        });

        // Notify others
        socketRef.current.emit('user-stream-state-changed', {
            hasVideo: isVideoOn,
            hasAudio: !isMuted
        });

        // Initiate connections with participants without connection
        otherParticipants.forEach(participant => {
            if (!peerConnectionsRef.current.has(participant.id)) {
                initiateConnectionWithUser(participant.id);
            }
        });
    }, [localStream, isVideoOn, isMuted, otherParticipants, initiateConnectionWithUser]);

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
    }, [cleanupSpeakingDetection, localStream]);

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
                        handleChatMessages={() => setActiveView('chat')}
                        handleParticipantsList={() => setActiveView('participants')}
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