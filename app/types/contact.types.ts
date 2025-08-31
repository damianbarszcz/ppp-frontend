
import { UserProfile } from './user.types';

export interface Contact {
    id: number;
    user_id: number;
    status: 'pending' | 'accepted';
    contact_user_id: number;
    contact_user?: ContactUser;
    creator?: ContactCreator;
    created_at: string;
    updated_at: string;
}

export interface ContactUser {
    id: number;
    email: string;
    account_type: string;
    password_length: number;
    profile: UserProfile;
    created_at: string;
    updated_at: string;
}

export interface ContactCreator {
    id: number;
    email: string;
    account_type: string;
    password_length: number;
    profile: UserProfile;
    created_at: string;
    updated_at: string;
}