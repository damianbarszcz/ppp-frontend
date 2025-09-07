import React from "react";
import { getInitials } from "@/app/components/utils/avatar";
import { isDarkColor } from "@/app/components/utils/color";
import { Mentor } from '@/app/types/user.types';

interface MentorProfilePropertiesProps{
    mentor: Mentor,
    articles: any[];
    followers: any[];
}

const MentorFinderProperties : React.FC<MentorProfilePropertiesProps> = ({
    mentor,
    articles,
    followers
} : MentorProfilePropertiesProps) => {
    const initials = getInitials(mentor.profile.name, mentor.profile.surname);
    const isDark = isDarkColor(mentor.profile.user_avatar_color);
    const textColorClass = isDark ? 'text-white' : 'text-black';

    return (
        <section>
            <div className="w-full h-[300px]" style={{backgroundColor: mentor.profile.user_avatar_color, filter: 'brightness(0.5)'}}></div>

            <div className="max-w-6xl m-auto mt-10 text-center  transform -translate-y-[120px]">
                <figure className="relative m-auto h-36 w-36 rounded-full" style={{ backgroundColor: mentor.profile.user_avatar_color }}>
                        <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-semibold text-5xl ${textColorClass}`}>
                            {initials}
                        </span>
                </figure>

                <div className="mt-5 m-auto max-w-xl">
                    <div>
                        <header className="mb-2.5">
                            <h1 className="text-2xl font-regular text-app-dark font-semibold">
                                {mentor.profile.name} {mentor.profile.surname}
                            </h1>
                        </header>

                        <div className="mb-5">
                               <span className="text-base font-medium text-app-silver">
                                   @{mentor.profile.username}
                               </span>
                        </div>

                        <div className="mb-2.5">
                            <p className="text-base font-regular text-app-silver">
                                {mentor.profile.biogram}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center mt-4">
                        <p className="mt-4 text-base mr-5">
                            <span className="font-semibold text-app-black">{articles.length}</span> <span className="text-app-silver  font-medium">artykuły</span>
                        </p>
                        <p className="mt-4 text-base ml-5">
                            <span className="font-semibold text-app-black">{followers.length}</span> <span className="text-app-silver  font-medium">obserwujących</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MentorFinderProperties;