import {User} from "@/app/types/user.types";

export interface ChannelMessage{
    id: number;
    content: string;
    created_at: string;
    team_id: number;
    user: User;
}

export interface ActiveParticipant {
    id: number;
    profile: {
        name: string;
        surname: string;
        username: string;
        user_avatar_color: string;
    };
}