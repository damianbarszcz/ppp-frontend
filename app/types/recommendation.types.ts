export interface SearchFormData {
    collaboration_areas: string[];
    experience_level: string;
    industries: string[];
    required_skills: string[];
    project_type: string;
    time_commitment: string;
    work_modes: string[];
    budget_range: string;
    location: string;
    additional_notes: string;
}

export interface MatchedPerson {
    user_id: number;
    name: string;
    username: string;
    email: string;
    avatar_color: string;
    about_me: string;
    specialization?: string;
    is_premium?: boolean;
    rating?: number;
    location?: string;
    match_score: number;
    match_reasons: string[];
    collaboration_areas?: string[];
    experience_level?: string;
    industries?: string[];
}

export interface SearchResults {
    success: boolean;
    search_id: string;
    mentors: MatchedPerson[];
    partners: MatchedPerson[];
    total_matches: number;
    message: string;
    metadata?: {
        algorithm_version?: string;
        total_profiles_analyzed?: number;
        content_based_matches?: number;
        collaborative_boost_applied?: boolean;
        search_timestamp?: string;
    };
}
