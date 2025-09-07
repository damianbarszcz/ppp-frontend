import {Article} from "@/app/types/article.types";

export interface User {
    id: number;
    email: string;
    account_type: string;
    password_length:number;
    profile: UserProfile;
    followers: Follower[];
    articles: Article[];
}

export interface Mentor {
    id: number;
    account_type: string;
    profile: UserProfile;
    followers: Follower[];
    articles: Article[];
}

export interface UserProfile {
    id: number;
    name: string;
    surname: string;
    username: string;
    biogram:string;
    user_avatar_color: string;
    mentor_subscribe_price?: number;
    created_at: string;
    updated_at: string;
}

export interface Follower {
    id: number;
    mentor_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    follower: User;
}