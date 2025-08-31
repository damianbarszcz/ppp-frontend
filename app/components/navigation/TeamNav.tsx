import React from "react";
import {getInitials} from "@/app/components/utils/avatar";
import {isDarkColor} from "@/app/components/utils/color";
import { User, Team } from '@/app/types';
import NavigationNotificationDropdown from "@/app/components/navigation/NavigationNotificationDropdown";
import NavigationAccountDropdown from "@/app/components/navigation/NavigationAccountDropdown";

interface TeamNavProps{
    user: User;
    handleLogout: (e:React.FormEvent) => void;
    accountDropdownOpen: boolean;
    notifyDropdownOpen: boolean;
    setAccountDropdownOpen: (open: boolean) => void;
    setNotifyDropdownOpen: (open: boolean) => void;
    team?: Team;
}

function TeamNav({
    user,
    handleLogout,
    accountDropdownOpen,
    setAccountDropdownOpen,
    notifyDropdownOpen,
    setNotifyDropdownOpen,
    team
}: TeamNavProps) {
    const initials = getInitials(user.profile.name, user.profile.surname);
    const isDark = isDarkColor(user.profile.user_avatar_color);
    const textColorClass = isDark ? 'text-white' : 'text-black';

    return (
        <nav className="w-full pb-3 pt-3 bg-custom-blue">
            <div className="flex justify-between items-center pr-10 pl-10">
                <div className="flex items-center">
                       <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M5 16.6667L5.83333 13.3334H2.5L2.91667 11.6667H6.25L7.08333 8.33337H3.75L4.16667 6.66671H7.5L8.33333 3.33337H10L9.16667 6.66671H12.5L13.3333 3.33337H15L14.1667 6.66671H17.5L17.0833 8.33337H13.75L12.9167 11.6667H16.25L15.8333 13.3334H12.5L11.6667 16.6667H10L10.8333 13.3334H7.5L6.66667 16.6667H5ZM7.91667 11.6667H11.25L12.0833 8.33337H8.75L7.91667 11.6667Z" fill="#E3E3E3"/>
                           </svg>
                       </span>
                    <span className="flex font-body text-lg font-semibold text-white pl-2">
                           {team?.title || ''}
                       </span>
                </div>

                <div className="flex justify-end items-center col-span-2">
                    {user?.account_type === "P" && (
                        <>
                            <a href="/member/prospector/search-creator" className="hidden block p-2 mr-6 global--border-blue rounded-sm
                            text-sm font-body font-semibold global--text-link" target="_self">Kreator Poszukiwań</a>

                            <button type="button" onClick={() => setNotifyDropdownOpen(!notifyDropdownOpen)} className="relative h-10 w-10 mr-3.5 rounded-full border border-app-dark">
                                <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-base`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3C4043">
                                        <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0
                                         420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/>
                                    </svg>
                                </span>
                            </button>
                        </>
                    )}

                    <button type="button" onClick={() => setAccountDropdownOpen(!accountDropdownOpen)} className="relative h-10 w-10 rounded-full" style={{ backgroundColor: user.profile.user_avatar_color }}>
                           <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-base ${textColorClass}`}>
                               {initials}
                           </span>
                    </button>
                </div>
            </div>

            {notifyDropdownOpen && (<NavigationNotificationDropdown />)}

            {accountDropdownOpen && (<NavigationAccountDropdown user={ user } handleLogout={handleLogout} />)}
        </nav>
    );
}

export default TeamNav;