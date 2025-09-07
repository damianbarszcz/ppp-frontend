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

    // Update existing peer connections with new stream
    const updatePeerConnectionsWithStream = useCallback((stream: MediaStream | null) => {
        console.log('Updating peer connections with new stream');

        peerConnectionsRef.current.forEach((pc, userId) => {
            if (stream) {
                // Najpierw usuń stare tracki
                const senders = pc.getSenders();
                senders.forEach(sender => {
                    if (sender.track) {
                        pc.removeTrack(sender);
                    }
                });

                // Dodaj nowe tracki
                stream.getTracks().forEach(track => {
                    console.log(`Adding ${track.kind} track to peer ${userId}`);
                    pc.addTrack(track, stream);
                });
            } else {
                // Usuń wszystkie tracki jeśli nie ma strumienia
                const senders = pc.getSenders();
                senders.forEach(sender => {
                    if (sender.track) {
                        pc.removeTrack(sender);
                    }
                });
            }
        });

        // Renegocjuj połączenia
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

    // Create peer connection for new user
    const createPeerConnection = useCallback((userId: number) => {
        console.log('Creating peer connection for user:', userId);

        // Sprawdź czy połączenie już istnieje
        const existingConnection = peerConnectionsRef.current.get(userId);
        if (existingConnection &&
            (existingConnection.connectionState === 'connected' ||
                existingConnection.connectionState === 'connecting')) {
            console.log('Reusing existing connection for user:', userId);
            return existingConnection;
        }

        // Zamknij stare połączenie jeśli istnieje
        if (existingConnection) {
            console.log('Closing old connection for user:', userId);
            existingConnection.close();
        }

        const peerConnection = new RTCPeerConnection(rtcConfig);

        // Dodaj lokalne tracki jeśli istnieją
        if (localStream) {
            console.log('Adding local stream tracks to new peer connection');
            localStream.getTracks().forEach(track => {
                console.log('Adding track:', track.kind, track.enabled);
                peerConnection.addTrack(track, localStream);
            });
        }

        // Obsługa zdalnego strumienia
        peerConnection.ontrack = (event) => {
            console.log('Received remote stream from user:', userId, event.streams);
            const [remoteStream] = event.streams;

            if (remoteStream && remoteStream.getTracks().length > 0) {
                console.log('Remote stream tracks:', remoteStream.getTracks());
                setStreams(prev => {
                    const newStreams = new Map(prev);
                    newStreams.set(userId, remoteStream);
                    console.log('Updated streams map, size:', newStreams.size);
                    return newStreams;
                });
            }
        };

        // Obsługa ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                console.log('Sending ICE candidate to user:', userId);
                socketRef.current.emit('ice-candidate', {
                    targetUserId: userId,
                    candidate: event.candidate
                });
            }
        };

        // Monitorowanie stanu połączenia
        peerConnection.onconnectionstatechange = () => {
            const state = peerConnection.connectionState;
            console.log(`Peer connection state for user ${userId}:`, state);

            setConnectionStates(prev => {
                const newStates = new Map(prev);
                newStates.set(userId, state);
                return newStates;
            });

            if (state === 'failed') {
                console.log(`Connection failed for user ${userId}, will retry`);
                setTimeout(() => {
                    if (socketRef.current && activeParticipants.some(p => p.id === userId)) {
                        console.log(`Retrying connection for user ${userId}`);
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

    // Inicjuj połączenie z użytkownikiem
    const initiateConnectionWithUser = useCallback(async (userId: number) => {
        if (!socketRef.current) return;

        console.log(`Initiating connection with user ${userId}`);
        const peerConnection = createPeerConnection(userId);

        try {
            const offer = await peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });

            await peerConnection.setLocalDescription(offer);
            console.log(`Sending offer to user ${userId}`);

            socketRef.current.emit('offer', {
                targetUserId: userId,
                offer: offer
            });
        } catch (error) {
            console.error(`Error creating offer for user ${userId}:`, error);
        }
    }, [createPeerConnection]);

    // Handle incoming offer
    const handleOffer = useCallback(async (data: {fromUserId: number, offer: RTCSessionDescriptionInit}) => {
        console.log('Handling offer from user:', data.fromUserId);

        if (!data.offer || !data.offer.type || !data.offer.sdp) {
            console.error('Invalid offer received:', data.offer);
            return;
        }

        const peerConnection = createPeerConnection(data.fromUserId);

        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            console.log(`Sending answer to user ${data.fromUserId}`);
            if (socketRef.current) {
                socketRef.current.emit('answer', {
                    targetUserId: data.fromUserId,
                    answer: answer
                });
            }
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }, [createPeerConnection]);

    // Handle incoming answer
    const handleAnswer = useCallback(async (data: {fromUserId: number, answer: RTCSessionDescriptionInit}) => {
        console.log('Handling answer from user:', data.fromUserId);
        const peerConnection = peerConnectionsRef.current.get(data.fromUserId);
        if (peerConnection) {
            try {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            } catch (error) {
                console.error('Error handling answer:', error);
            }
        }
    }, []);

    // Handle incoming ICE candidate
    const handleIceCandidate = useCallback(async (data: {fromUserId: number, candidate: RTCIceCandidateInit}) => {
        const peerConnection = peerConnectionsRef.current.get(data.fromUserId);
        if (peerConnection) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (error) {
                console.error('Error handling ICE candidate:', error);
            }
        }
    }, []);

    // Socket initialization - tylko raz
    useEffect(() => {
        if (!user?.id || !singleTeam?.id) return;

        // Jeśli socket już istnieje i jest połączony, nie twórz nowego
        if (socketRef.current?.connected) {
            console.log('Socket already connected');
            return;
        }

        console.log('Creating new socket connection');
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
            // Jeśli mamy lokalny strumień, utwórz połączenie
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
    }, [user?.id, singleTeam?.id]); // Usuń zależności od callbacków

    // Osobny effect do obsługi zmian w lokalnym strumieniu
    useEffect(() => {
        if (localStream && socketRef.current?.connected) {
            console.log('Local stream changed, updating connections');

            // Aktualizuj istniejące połączenia
            updatePeerConnectionsWithStream(localStream);

            // Powiadom innych o stanie strumienia
            socketRef.current.emit('user-stream-state-changed', {
                hasVideo: isVideoOn,
                hasAudio: !isMuted
            });

            // Inicjuj połączenia z uczestnikami którzy jeszcze nie mają połączenia
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
            const audioTracks = stream.getAudioTracks();
            if (audioTracks.length === 0) {
                console.log('No audio tracks in stream');
                return;
            }

            console.log('Setting up speaking detection');

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

        // Powiadom innych o zmianie stanu
        if (socketRef.current) {
            socketRef.current.emit('user-stream-state-changed', {
                hasVideo: isVideoOn,
                hasAudio: !newMutedState
            });
        }
    };

    const handleToggleVideo = async (): Promise<void> => {
        console.log('Toggling video, current state:', isVideoOn);

        if (isVideoOn) {
            // Wyłączanie kamery
            console.log('Turning off camera');

            if (localStream) {
                // Zatrzymaj tylko video tracki
                localStream.getVideoTracks().forEach(track => {
                    track.stop();
                    localStream.removeTrack(track);
                });

                // Jeśli nie ma już żadnych tracków, usuń strumień
                if (localStream.getTracks().length === 0) {
                    setLocalStream(null);
                    streamRef.current = null;
                    cleanupSpeakingDetection();
                }
            }

            setIsVideoOn(false);

            // Powiadom innych
            if (socketRef.current) {
                socketRef.current.emit('user-stream-state-changed', {
                    hasVideo: false,
                    hasAudio: !isMuted
                });
            }

        } else {
            // Włączanie kamery
            console.log('Turning on camera');
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
                console.log('New camera stream obtained:', stream.getTracks());

                // Ustaw strumień audio na odpowiedni stan
                const audioTrack = stream.getAudioTracks()[0];
                if (audioTrack) {
                    audioTrack.enabled = !isMuted;
                }

                setLocalStream(stream);
                setIsVideoOn(true);
                streamRef.current = stream;

                // Setup speaking detection
                if (!isMuted) {
                    setupSpeakingDetection(stream);
                }

                console.log('Camera turned on successfully');
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