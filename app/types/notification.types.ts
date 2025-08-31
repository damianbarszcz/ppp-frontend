import {UserProfile} from "@/app/types/user.types";

export interface Notification {
    id: number;
    user_id: number;
    sender_id: number;
    message: string;
    created_at: string;
    updated_at: string;
    sender?: NotificationSender;
}

export interface NotificationSender {
    id: number;
    email: string;
    account_type: string;
    profile: UserProfile;
    created_at: string;
    updated_at: string;
}