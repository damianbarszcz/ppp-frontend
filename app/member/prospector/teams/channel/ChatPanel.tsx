import React from "react";
import {ActiveParticipant, ChannelMessage} from "@/app/types";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import {getInitials} from "@/app/components/utils/avatar";
import {isDarkColor} from "@/app/components/utils/color";
import {useAuth} from "@/app/context/AuthContext";

interface ChatPanelProps {
    sendMessage: (e: React.FormEvent) => void;
    messages: ChannelMessage[];
    activeParticipants: ActiveParticipant[];
    setMessage: (message: string) => void;
    handleChatMessages: () => void;
    handleParticipantsList: () => void;
    message: string;
    activeView: 'chat' | 'participants';
    participantsCount: number;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
    sendMessage,
    messages  = [],
    activeParticipants = [],
    setMessage,
    message,
    handleChatMessages,
    handleParticipantsList,
    activeView,
    participantsCount
} : ChatPanelProps) => {
    const {user} = useAuth();

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'});
    };

    return(
        <section className="w-full h-full col-span-3 row-span-11 rounded-md border border-app-blue">
            <div className="h-full grid grid-rows-10">
                <div className="row-span-1">
                    <div className="flex justify-center items-center h-full pt-3 pb-3 pl-3 pr-3 border-b border-app-blue">
                        <div className="mr-2">
                            <Button type="button" uiType={`${activeView === 'chat' ? 'primary' : 'blue-outline'}`} size="extraSmallSize" onClick={handleChatMessages}>Czat</Button>
                        </div>

                        <div className="ml-2">
                            <Button type="button" uiType={`${activeView === 'participants' ? 'primary' : 'blue-outline'}`} size="extraSmallSize" onClick={handleParticipantsList}>Uczestnicy ({participantsCount})</Button>
                        </div>
                    </div>
                </div>

                <div className="row-span-8 overflow-y-auto pt-3 pb-3 pl-3 pr-3">
                    {activeView === 'chat' ? (
                        <div className="space-y-3">
                            {messages.length === 0 ? (
                                <div className="text-center text-app-silver mt-10">
                                    <span className="block text-base font-medium text-app-dark">Witamy na kanale!</span>
                                    <span className="block mt-2 text-sm text-app-silver">Nikt jeszcze nie napisał żadnej wiadomości.</span>
                                </div>
                            ) : (
                                <div>
                                    { messages.map((message, index) => {
                                        if (!message.user || !message.user.profile) {
                                            return null;
                                        }
                                        const isCurrentUser = message.user.id === user?.id;
                                        const initials = getInitials(message.user.profile.name, message.user.profile.surname);
                                        const isDark = isDarkColor(message.user.profile.user_avatar_color);
                                        const textColorClass = isDark ? 'text-white' : 'text-black';

                                        return (
                                            <div key={message.id || index} className={`pt-2 pb-2 pl-1.5 pr-1.5 mb-2 w-full flex rounded-md ${isCurrentUser ? 'bg-app-blue/70' : 'bg-app-silver/10'}`}>
                                                <figure className="relative h-12 w-12 rounded-full flex-shrink-0" style={{ backgroundColor: message.user.profile.user_avatar_color }}>
                                                    <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-semibold text-base ${textColorClass}`}>
                                                        {initials}
                                                    </span>
                                                </figure>

                                                <div className="ml-2.5 mr-2 flex-1">
                                                    <div className="flex justify-between mb-0.5">
                                                        <span className={`font-medium text-xs ${isCurrentUser ? 'text-app-white' : 'text-app-black'}`}>
                                                            {message.user.profile.name} {message.user.profile.surname}
                                                        </span>
                                                        <span className={`font-medium text-xs ${isCurrentUser ? 'text-app-white' : 'text-app-black'}`}>
                                                            {formatTimestamp(message.created_at)}
                                                        </span>
                                                    </div>

                                                    <div className={`text-sm leading-snug ${isCurrentUser ? 'text-app-dark-white' : 'text-app-silver'}`}>
                                                        {message.content}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-1 mt-3">
                            {participantsCount === 0 ? (
                                <div className="text-center text-app-dark mt-10">
                                    <span className="block text-base font-medium text-app-dark">Brak uczestników</span>
                                </div>
                            ) : (
                                <div>
                                    {activeParticipants.map((participant, index) => {
                                        const initials = getInitials(participant.profile.name, participant.profile.surname);
                                        const isDark = isDarkColor(participant.profile.user_avatar_color);
                                        const textColorClass = isDark ? 'text-white' : 'text-black';

                                        return (
                                            <div key={participant.id || index} className="flex items-center mb-3 pl-5 pr-5">
                                                <figure className="relative h-14 w-14 rounded-full flex-shrink-0" style={{ backgroundColor: participant.profile.user_avatar_color }}>
                                                    <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-semibold text-base ${textColorClass}`}>
                                                        {initials}
                                                    </span>
                                                </figure>

                                                <span className="ml-5 text-base font-medium text-app-dark">
                                                    {participant.profile.name} {participant.profile.surname}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center row-span-1 pt-2 pb-2 pl-3 pr-3 border-t border-app-blue">
                    <form className="relative w-full" onSubmit={sendMessage}>
                        <Input
                            isLabel={false}
                            labelCaption=""
                            name="message"
                            type="text"
                            placeholder="Wyślij wiadomość..."
                            uiType="light"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            validateError=""
                        />

                        <button className="absolute right-2 top-2 bg-app-blue hover:bg-app-dark-blue p-2 rounded-md" disabled={!message.trim()} type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22" fill="#ffffff">
                                <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ChatPanel;