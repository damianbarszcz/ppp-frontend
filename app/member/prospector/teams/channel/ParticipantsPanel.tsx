import React, { useEffect, useRef, memo } from "react";
import { ActiveParticipant } from "@/app/types";
import { getInitials } from "@/app/components/utils/avatar";
import { isDarkColor } from "@/app/components/utils/color";
import { useAuth } from "@/app/context/AuthContext";

interface ParticipantsPanelProps {
    activeParticipants: ActiveParticipant[];
    participantsCount: number;
    localStream?: MediaStream | null;
    streams?: Map<number, MediaStream>;
    isVideoOn?: boolean;
    isMuted?: boolean;
    isSpeaking?: boolean;
}

const ParticipantVideo = memo(({
   participant,
   isCurrentUser,
   hasVideo,
   stream,
   localStream,
   isUserSpeaking,
   participantsCount
}: {
    participant: ActiveParticipant;
    isCurrentUser: boolean;
    hasVideo: boolean;
    stream?: MediaStream;
    localStream?: MediaStream | null;
    isUserSpeaking: boolean;
    participantsCount: number;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (!videoRef.current || !hasVideo) return;

        const videoStream = isCurrentUser ? localStream : stream;
        if (videoStream && videoRef.current.srcObject !== videoStream) {
            videoRef.current.srcObject = videoStream;
            videoRef.current.play().catch(console.error);
        }
    }, [hasVideo, stream, localStream, isCurrentUser]);

    const initials = getInitials(participant.profile.name, participant.profile.surname);
    const isDark = isDarkColor(participant.profile.user_avatar_color);
    const textColorClass = isDark ? 'text-white' : 'text-black';

    return (
        <div className={`relative bg-app-black rounded-lg overflow-hidden ${isUserSpeaking ? 'ring-4 ring-green-400 ring-opacity-80 shadow-lg shadow-green-400/50' : ''}`} style={{ minHeight: '200px' }}>
            {hasVideo ? (
                <div className="w-full h-full relative">
                    <video ref={videoRef} autoPlay muted={isCurrentUser} playsInline className="w-full h-full object-cover rounded-lg" style={{transform: isCurrentUser ? "scaleX(-1)" : "none", aspectRatio: "16/9"}}/>
                </div>
            ) : (
                <div className="w-full h-full bg-app-black flex items-center justify-center rounded-lg"
                     style={{ aspectRatio: "16/9" }}>
                    <figure className={`relative rounded-full transition-all duration-300 ${isUserSpeaking ? 'ring-4 ring-green-400 ring-opacity-80 scale-110' : ''}`}
                        style={{
                            backgroundColor: participant.profile.user_avatar_color,
                            width: getAvatarSize(participantsCount),
                            height: getAvatarSize(participantsCount)
                        }}>
                        <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-semibold ${getTextSize(participantsCount)} ${textColorClass}`}>
                            {initials}
                        </span>
                    </figure>
                </div>
            )}

            <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-md transition-all duration-200 backdrop-blur-sm ${
                isUserSpeaking ? 'bg-app-green bg-opacity-90 shadow-lg' : 'bg-app-black bg-opacity-60'
            }`}>
                <span className="text-white text-sm font-medium flex items-center gap-2">
                    {isUserSpeaking && <SpeakingIndicator />}
                    {participant.profile.name} {participant.profile.surname}
                    {isCurrentUser && ' (Ty)'}
                </span>
            </div>

            <StatusIndicators hasVideo={hasVideo} isMuted={!isCurrentUser || !isUserSpeaking} isUserSpeaking={isUserSpeaking} />
        </div>
    );
});

ParticipantVideo.displayName = 'ParticipantVideo';

const SpeakingIndicator = memo(() => (
    <span className="flex gap-0.5">
        {[0, 200, 400].map(delay => (
            <span key={delay} className="w-1 h-3 bg-app-green rounded animate-pulse" style={{ animationDelay: `${delay}ms` }}/>
        ))}
    </span>
));

SpeakingIndicator.displayName = 'SpeakingIndicator';

const StatusIndicators = memo(({ hasVideo, isMuted, isUserSpeaking }: {
    hasVideo: boolean;
    isMuted: boolean;
    isUserSpeaking: boolean;
}) => (
    <div className="absolute top-2 right-2 flex gap-1">
        <div className={`p-1.5 rounded-full transition-all duration-200 backdrop-blur-sm ${
            hasVideo ? 'bg-app-green shadow-lg shadow-green-500/50' : 'bg-app-silver'
        }`}>
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="white">
                {hasVideo ? (
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                ) : (
                    <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27L4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"/>
                )}
            </svg>
        </div>

        <div className={`p-1.5 rounded-full transition-all duration-200 backdrop-blur-sm ${
            !isMuted ? (isUserSpeaking ? 'bg-app-green shadow-lg shadow-green-500/50 animate-pulse' : 'bg-app-green') : 'bg-app-red'
        }`}>
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="white">
                {!isMuted ? (
                    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                ) : (
                    <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
                )}
            </svg>
        </div>
    </div>
));

StatusIndicators.displayName = 'StatusIndicators';

const getGridLayout = (count: number): string => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 lg:grid-cols-2";
    if (count <= 4) return "grid-cols-1 md:grid-cols-2";
    if (count <= 6) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    if (count <= 9) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
};

const getAvatarSize = (count: number): string => {
    if (count === 1) return "120px";
    if (count === 2) return "100px";
    if (count <= 4) return "80px";
    if (count <= 6) return "60px";
    return "50px";
};

const getTextSize = (count: number): string => {
    if (count === 1) return "text-4xl";
    if (count === 2) return "text-3xl";
    if (count <= 4) return "text-2xl";
    if (count <= 6) return "text-xl";
    return "text-lg";
};

const ParticipantsPanel: React.FC<ParticipantsPanelProps> = ({
     activeParticipants = [],
     participantsCount,
     localStream = null,
     streams = new Map(),
     isVideoOn = false,
     isMuted = true,
     isSpeaking = false
}) => {
    const { user } = useAuth();


    const visibleParticipants = React.useMemo(() =>
            activeParticipants.slice(0, 12),
        [activeParticipants]
    );
    const gridLayout = React.useMemo(() =>
            getGridLayout(participantsCount),
        [participantsCount]
    );

    return (
        <section className="w-full col-span-9 row-span-11">
            <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden relative p-4">
                <div className={`grid gap-4 h-full transition-all duration-700 ease-in-out auto-rows-fr ${gridLayout}`}>
                    {visibleParticipants.map((participant) => {
                        const isCurrentUser = participant.id === user?.id;
                        const hasVideo = isCurrentUser ? (!!localStream && isVideoOn) : streams.has(participant.id);
                        const isUserSpeaking = isCurrentUser ? (isSpeaking && !isMuted) : false;

                        return (
                            <ParticipantVideo
                                key={participant.id}
                                participant={participant}
                                isCurrentUser={isCurrentUser}
                                hasVideo={hasVideo}
                                stream={streams.get(participant.id)}
                                localStream={localStream}
                                isUserSpeaking={isUserSpeaking}
                                participantsCount={participantsCount}
                            />
                        );
                    })}
                </div>

                {participantsCount > 12 && (
                    <div className="absolute bottom-4 right-4 bg-app-black bg-opacity-70 text-app-white px-3 py-2 rounded-lg">
                        <span className="text-sm">+{participantsCount - 12} więcej uczestników</span>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes pulse-border {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
                    50% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
                }
                
                @keyframes pulse-avatar {
                    0%, 100% { 
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
                    }
                    50% { 
                        transform: scale(1.05);
                        box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
                    }
                }
            `}</style>
        </section>
    );
};

export default memo(ParticipantsPanel);