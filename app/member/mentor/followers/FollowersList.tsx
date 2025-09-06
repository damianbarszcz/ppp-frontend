import React from "react";
import {getInitials} from "@/app/components/utils/avatar";
import {isDarkColor} from "@/app/components/utils/color";
import { Follower } from '@/app/types/user.types';

interface FollowersListProps {
    followers: Follower[];
}

const FollowersList: React.FC<FollowersListProps> = ({followers}: FollowersListProps) => {
    return (
        <div className="m-auto mt-10 w-full max-w-[650px] min-h-[300px] rounded-[8px] global--border-d-white">
            {followers.length > 0 ? (
                followers.map((followerData, index) => {
                    const user = followerData.follower;
                    const profile = user.profile;
                    const initials = getInitials(profile.name, profile.surname);
                    const isDark = isDarkColor(profile.user_avatar_color);
                    const textColorClass = isDark ? 'text-app-white' : 'text-app-black';

                    return (
                        <div key={followerData.id}
                             className={`w-full min-h-[100px] flex items-center ${
                                 index !== followers.length - 1 ? 'global--b-border-d-white' : ''
                             }`}>
                            <figure className="relative ml-10 rounded-[8px] h-16 w-16"
                                    style={{ backgroundColor: profile.user_avatar_color}}>
                                <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-semibold text-2xl ${textColorClass}`}>
                                    {initials}
                                </span>
                            </figure>

                            <div className="ml-7">
                                <div className="text-base global--text-dark font-semibold">
                                    {profile.name} {profile.surname}
                                </div>
                                <div className="text-base global--text-silver mt-1">
                                    {profile.username}
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="mt-10 mb-10 w-full p-10">
                    <p className="text-center text-base global--text-dark font-semibold">Brak obserwujących</p>
                </div>
            )}
        </div>
    );
}

export default FollowersList;