// types/profile.types.ts

export interface ProspectorProfileFormData {
    aboutMe: string;
    specialization: string;
    location: string;
    collaborationAreas: string[];
    workModes: string[];
    experienceLevel: string;
    industries: string[];
    requiredSkills: string[];
    projectType: string;
    timeCommitment: string;
    budgetRange: string;
    availabilityStatus: string;
    additionalNotes: string;
}

export interface ProspectorProfileFormProps {
    formData: ProspectorProfileFormData;
    updateFormData: (data: Partial<ProspectorProfileFormData>) => void;
    publishProspectorProfile: (e: React.FormEvent) => Promise<void>;
    validationErrors: ProfileCreatorValidationFrontendError;
}

export interface ProfileCreatorValidationFrontendError {
    aboutMeError: string;
    specializationError?: string;
    collaborationAreasError?: string;
    experienceLevelError?: string;
    industriesError?: string;
    projectTypeError?: string;
    timeCommitmentError?: string;
    workModesError?: string;
    budgetRangeError?: string;
}

export interface MentorProfileFormData {
    // Podstawowe informacje
    aboutMe: string;
    specialization: string;
    yearsOfExperience: number;
    currentPosition: string;
    location: string;

    // Kluczowe pola dla algorytmu dopasowania
    expertiseAreas: string[];        // W czym mentor jest ekspertem
    targetAudience: string[];        // Komu pomaga ['junior', 'mid', 'senior', 'career-change']
    mentoringTopics: string[];       // Konkretne tematy pomocy
    industries: string[];            // Branże doświadczenia
    skills: string[];               // Umiejętności techniczne/miękkie

    // Dodatkowe
    additionalNotes: string;
}

export interface MentorProfileFormProps {
    formData: MentorProfileFormData;
    updateFormData: (data: Partial<MentorProfileFormData>) => void;
    publishMentorProfile: (e: React.FormEvent) => void;
    validationErrors: MentorProfileValidationError;
}

export interface MentorProfileValidationError {
    aboutMeError: string;
    specializationError: string;
    yearsOfExperienceError: string;
    currentPositionError: string;
    locationError: string;
    expertiseAreasError: string;
    targetAudienceError: string;
    mentoringTopicsError: string;
    industriesError: string;
    skillsError: string;
    additionalNotesError: string;
}