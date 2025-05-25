import React from "react";
import {getInitials} from "@/app/components/utils/avatar";
import {isDarkColor} from "@/app/components/utils/color";

interface ParticipantsPanelProps{
    user: User;
}

interface User {
    id: number;
    email: string;
    account_type: string;
    name:string;
    surname:string;
    user_avatar_color: string;
}

const ParticipantsPanel : (user: any) => React.JSX.Element = (user:any) => {
    const initials = getInitials(user.name, user.surname);
    const isDark = isDarkColor(user.user_avatar_color);
    const textColorClass = isDark ? 'text-white' : 'text-black';

    return (
        <section className="w-full col-span-9 row-span-11">
            <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
                <div className="bg-custom-blue rounded-md relative">
                    <figure className="relative m-auto h-24 w-24 rounded-full" style={{ backgroundColor: "red" }}>
                        <span className={`absolute top-1/2 left-1/2 transform 
                        -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-4xl ${textColorClass}`}>
                            {initials}
                        </span>
                    </figure>
                </div>
                <div className="bg-custom-blue rounded-md relative">
                    <figure className="relative m-auto h-24 w-24 rounded-full" style={{ backgroundColor: "red" }}>
                        <span className={`absolute top-1/2 left-1/2 transform 
                        -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-4xl ${textColorClass}`}>
                            {initials}
                        </span>
                    </figure>
                </div>
                <div className="bg-custom-blue rounded-md relative">
                    <figure className="relative m-auto h-24 w-24 rounded-full" style={{ backgroundColor: "red" }}>
                        <span className={`absolute top-1/2 left-1/2 transform 
                        -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-4xl ${textColorClass}`}>
                            {initials}
                        </span>
                    </figure>
                </div>
                <div className="bg-custom-blue rounded-md relative">
                    <figure className="relative m-auto h-24 w-24 rounded-full" style={{ backgroundColor: "red" }}>
                        <span className={`absolute top-1/2 left-1/2 transform 
                        -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-4xl ${textColorClass}`}>
                            {initials}
                        </span>
                    </figure>
                </div>
                <div className="bg-custom-blue rounded-md relative">
                    <figure className="mt-12 relative m-auto h-24 w-24 rounded-full" style={{ backgroundColor: "red" }}>
                        <span className={`absolute top-1/2 left-1/2 transform 
                        -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-4xl ${textColorClass}`}>
                            {initials}
                        </span>
                    </figure>
                </div>
                <div className="bg-custom-blue rounded-md relative">
                    <figure className="mt-12 relative m-auto h-24 w-24 rounded-full" style={{ backgroundColor: "red" }}>
                        <span className={`absolute top-1/2 left-1/2 transform 
                        -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-4xl ${textColorClass}`}>
                            {initials}
                        </span>
                    </figure>
                </div>
                <div className="bg-custom-blue rounded-md relative">
                    <figure className="mt-12 relative m-auto h-24 w-24 rounded-full" style={{ backgroundColor: "red" }}>
                        <span className={`absolute top-1/2 left-1/2 transform 
                        -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-4xl ${textColorClass}`}>
                            {initials}
                        </span>
                    </figure>
                </div>
                <div className="bg-custom-blue rounded-md relative">
                    <figure className="mt-12 relative m-auto h-24 w-24 rounded-full" style={{ backgroundColor: "red" }}>
                        <span className={`absolute top-1/2 left-1/2 transform 
                        -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-4xl ${textColorClass}`}>
                            {initials}
                        </span>
                    </figure>
                </div>
                <div className="bg-custom-blue rounded-md relative">
                    <figure className="mt-12 relative m-auto h-32 w-32 rounded-full" style={{ backgroundColor: "red" }}>
                        <span className={`absolute top-1/2 left-1/2 transform 
                        -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-4xl ${textColorClass}`}>
                            {initials}
                        </span>
                    </figure>
                </div>
            </div>
        </section>
    );
}

export default  ParticipantsPanel;