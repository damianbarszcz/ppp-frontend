
export interface Team {
    id: number;
    title: string;
    team_details: {
        description: string;
        tags: string[];
        team_avatar_color: string;
    };
}

export interface TeamInvitation {
    id: number;
    team_id: number;
    invited_user_id: number;
    inviter_user_id: number;
    status: 'pending' | 'accepted';
    team: {
        id: number;
        title: string;
        slug: string;
        team_details: {
            description: string;
            tags: string[];
            team_avatar_color: string;
        }
    };
    inviter?: {
        id: number;
        profile: {
            name: string;
            surname: string;
            username: string;
        }
    };
    created_at: string;
}
