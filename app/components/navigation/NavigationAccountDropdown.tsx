import React from "react";
import Link from "next/link";
import {getInitials} from "@/app/components/utils/avatar";
import {isDarkColor} from "@/app/components/utils/color";
import { User } from '@/app/types/user.types';

interface NavigationAccountDropdownProps{
    user: User,
    handleLogout: (e:React.FormEvent) => void;
}

function NavigationAccountDropdown({user, handleLogout}: NavigationAccountDropdownProps) {
    const initials = getInitials(user.profile.name, user.profile.surname);
    const isDark = isDarkColor(user.profile.user_avatar_color);
    const textColorClass = isDark ? 'text-white' : 'text-black';

    return (
        <div className="absolute right-10 z-10 mt-2 w-[256px] h-[236px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="flex flex-col h-full">
                <div className="p-5 w-full text-center border-b global--b-border-d-white">
                    <figure className="relative m-auto h-16 w-16 rounded-full" style={{ backgroundColor: user.profile.user_avatar_color }}>
                        <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-2xl ${textColorClass}`}>
                            {initials}
                        </span>
                    </figure>

                    <div className="mt-4">
                        <div className="text-base text-app-dark font-medium">{user.profile.name} {user.profile.surname}</div>
                        <div className="text-xs text-app-silver">{user.email}</div>
                    </div>
                </div>

                <div className="w-full">
                    <div className="w-full pt-1.5 pb-1.5 text-center border-b global--b-border-d-white">
                        <Link href="/member/settings" className="text-sm text-app-blue" target="_self">Ustawienia</Link>
                    </div>

                    <div className="w-full pt-1.5 pb-1.5 text-center">
                        <Link href="#" className="text-sm text-app-blue" target="_self"
                              onClick={(e) => handleLogout(e)}>
                            Wyloguj
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavigationAccountDropdown;