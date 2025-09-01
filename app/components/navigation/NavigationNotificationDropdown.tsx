import React, {useEffect, useState} from "react";
import axios from "axios";
import {API_CONFIG} from "@/app/config/global";
import {useAuth} from "@/app/context/AuthContext";
import {Notification} from "@/app/types";
import {getInitials} from "@/app/components/utils/avatar";
import {isDarkColor} from "@/app/components/utils/color";


function NavigationNotificationDropdown() {
    const {user} = useAuth();
    const [yourNotifications, setYourNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const fetchNotifications = async () : Promise<void> => {
            if (!user?.id) return;
            try {
                const response = await axios.get(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.notification.fetchNotify + user.id}`);
                if (response.data.success) {
                    setYourNotifications(response.data.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchNotifications();
    }, [user]);

    return (
        <div className="absolute right-10 z-10 mt-2 w-[300px] h-[236px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="flex flex-col h-full">
                <div className="pt-3.5 pb-3.5 pl-5 pr-5 text-app-dark text-sm text-left border-b global--b-border-d-white">
                    Powiadomienia
                </div>

                {yourNotifications.length > 0 ? (
                    <div className="flex-1 overflow-y-auto p-2">
                        {yourNotifications.map((notification: Notification) => {
                            const senderProfile = notification.sender?.profile;
                            const initials = senderProfile ?
                                getInitials(senderProfile.name, senderProfile.surname) :
                                '?';
                            const avatarColor = senderProfile?.user_avatar_color || '#ccc';
                            const isDark = isDarkColor(avatarColor);
                            const textColorClass = isDark ? 'text-white' : 'text-black';
                            const senderName = senderProfile ?
                                `${senderProfile.name} ${senderProfile.surname}` :
                                'Nieznany użytkownik';

                            return(
                                <div key={notification.id} className="flex items-center p-2 border-b global--b-border-d-white">
                                    <figure className="relative h-10 w-10 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: avatarColor }}>
                                        <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-sm ${textColorClass}`}>
                                            {initials}
                                        </span>
                                    </figure>

                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm">
                                            <span className="font-semibold text-app-dark">{senderName}</span>
                                            <span className="text-app-silver ml-1.5 mt-1">
                                                {notification.message}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex justify-center flex-col items-center h-full">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" height="64px" viewBox="0 -960 960 960" width="64px" fill="#5A5A5A">
                                <path d="M80-560q0-100 44.5-183.5T244-882l47 64q-60 44-95.5 111T160-560H80Zm720 0q0-80-35.5-147T669-818l47-64q75
                                55 119.5 138.5T880-560h-80ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5
                                17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5
                                56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/>
                            </svg>
                        </div>

                        <div className="mt-3.5 ml-10 mr-10 text-center">
                            <span className="text-sm text-center text-app-silver">Aktualnie nie masz żadnych powiadomień.</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NavigationNotificationDropdown;