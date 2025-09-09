"use client";

import {useAuth} from "@/app/context/AuthContext";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {API_CONFIG} from "@/app/config/global";
import ProtectedRoute from "@/app/routes/protected/ProtectedRoute";
import Message from "@/app/components/ui/Message";
import Navigation from "@/app/components/navigation/Navigation";
import MProfileCreatorForm from "./MProfileCreatorForm";
import {
    MentorProfileFormData,
    MentorProfileValidationError,
    ValidationError
} from "@/app/types";

export default function MentorProfilePage() {
    const { user, logout } = useAuth();
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
    const [msgSuccess, setMsgSuccess] = useState('');
    const [profileExists, setProfileExists] = useState(false);
    const [_profileId, setProfileId] = useState<number | null>(null);

    const [formData, setFormData] = useState<MentorProfileFormData>({
        // Podstawowe informacje
        aboutMe: "",
        specialization: "",
        yearsOfExperience: 0,
        currentPosition: "",
        location: "",

        // Kluczowe pola dla algorytmu
        expertiseAreas: [],
        targetAudience: [],
        mentoringTopics: [],
        industries: [],
        skills: [],

        // Dodatkowe
        additionalNotes: ""
    });

    const [validationErrors, setValidationErrors] = useState<MentorProfileValidationError>({
        aboutMeError: "",
        specializationError: "",
        yearsOfExperienceError: "",
        currentPositionError: "",
        locationError: "",
        expertiseAreasError: "",
        targetAudienceError: "",
        mentoringTopicsError: "",
        industriesError: "",
        skillsError: "",
        additionalNotesError: ""
    });

    useEffect(() => {
        const msgSuccessBox = sessionStorage.getItem('mentorProfileCreateSuccessMessage');
        if (msgSuccessBox) {
            setMsgSuccess(msgSuccessBox);
            sessionStorage.removeItem('mentorProfileCreateSuccessMessage');
        }
    }, []);

    useEffect(() => {
        const fetchMentorProfile = async () => {
            if (!user?.id) return;
            try {
                const response = await axios.get(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.profile.getMentorProfile + user.id}`);

                if (response.data.success && response.data.data) {
                    const profileData = response.data.data;

                    setFormData({
                        aboutMe: profileData.about_me || "",
                        specialization: profileData.specialization || "",
                        yearsOfExperience: profileData.years_of_experience || 0,
                        currentPosition: profileData.current_position || "",
                        location: profileData.location || "",
                        expertiseAreas: profileData.expertise_areas || [],
                        targetAudience: profileData.target_audience || [],
                        mentoringTopics: profileData.mentoring_topics || [],
                        industries: profileData.industries || [],
                        skills: profileData.skills || [],
                        additionalNotes: profileData.additional_notes || ""
                    });

                    setProfileExists(true);
                    setProfileId(profileData.id);
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    setProfileExists(false);
                } else {
                    console.error('Błąd podczas ładowania profilu mentora:', error);
                }
            }
        };

        fetchMentorProfile();
    }, [user?.id]);

    const updateFormData = (data: Partial<MentorProfileFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const clearAllErrors = () => {
        setValidationErrors({
            aboutMeError: "",
            specializationError: "",
            yearsOfExperienceError: "",
            currentPositionError: "",
            locationError: "",
            expertiseAreasError: "",
            targetAudienceError: "",
            mentoringTopicsError: "",
            industriesError: "",
            skillsError: "",
            additionalNotesError: ""
        });
    };

    const getValidationErrors = (errors: ValidationError[]) => {
        clearAllErrors();
        const newErrors: MentorProfileValidationError = {
            aboutMeError: "",
            specializationError: "",
            yearsOfExperienceError: "",
            currentPositionError: "",
            locationError: "",
            expertiseAreasError: "",
            targetAudienceError: "",
            mentoringTopicsError: "",
            industriesError: "",
            skillsError: "",
            additionalNotesError: ""
        };

        errors.forEach((error) => {
            switch (error.field) {
                case 'about_me':
                    newErrors.aboutMeError = error.message;
                    break;
                case 'specialization':
                    newErrors.specializationError = error.message;
                    break;
                case 'years_of_experience':
                    newErrors.yearsOfExperienceError = error.message;
                    break;
                case 'current_position':
                    newErrors.currentPositionError = error.message;
                    break;
                case 'location':
                    newErrors.locationError = error.message;
                    break;
                case 'expertise_areas':
                    newErrors.expertiseAreasError = error.message;
                    break;
                case 'target_audience':
                    newErrors.targetAudienceError = error.message;
                    break;
                case 'mentoring_topics':
                    newErrors.mentoringTopicsError = error.message;
                    break;
                case 'industries':
                    newErrors.industriesError = error.message;
                    break;
                case 'skills':
                    newErrors.skillsError = error.message;
                    break;
                case 'additional_notes':
                    newErrors.additionalNotesError = error.message;
                    break;
            }
        });
        setValidationErrors(newErrors);
    };

    const publishMentorProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        try {
            const apiData = {
                user_id: user.id,
                about_me: formData.aboutMe,
                specialization: formData.specialization,
                years_of_experience: formData.yearsOfExperience,
                current_position: formData.currentPosition,
                location: formData.location,
                expertise_areas: formData.expertiseAreas,
                target_audience: formData.targetAudience,
                mentoring_topics: formData.mentoringTopics,
                industries: formData.industries,
                skills: formData.skills,
                additional_notes: formData.additionalNotes
            };

            let response;
            if (profileExists) {
                response = await axios.put(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.profile.updateMentorProfile + user.id}`,
                    apiData
                );
            } else {
                response = await axios.post(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.profile.publishMentorProfile}`,
                    apiData
                );
            }

            if (response.data.success) {
                clearAllErrors();

                const successMessage = profileExists
                    ? 'Profil mentora został pomyślnie zaktualizowany!'
                    : response.data.message;

                sessionStorage.setItem('mentorProfileCreateSuccessMessage', successMessage);

                if (!profileExists) {
                    setProfileExists(true);
                    setProfileId(response.data.data?.id);
                }
                window.location.reload();
            }
        } catch (error) {
            if (error.response?.status === 422 && error.response?.data?.errors) {
                getValidationErrors(error.response.data.errors);
            } else {
                console.error('Wystąpił błąd:', error.message);
            }
        }
    };

    return (
        <ProtectedRoute>
            {msgSuccess && <Message message={msgSuccess} type="success" />}

            <Navigation
                activeSection="mentor-profile"
                user={user!}
                handleLogout={logout}
                accountDropdownOpen={accountDropdownOpen}
                setAccountDropdownOpen={setAccountDropdownOpen}
                notifyDropdownOpen={notifyDropdownOpen}
                setNotifyDropdownOpen={setNotifyDropdownOpen}
                type="standard"
            />

            <MProfileCreatorForm
                formData={formData}
                updateFormData={updateFormData}
                publishMentorProfile={publishMentorProfile}
                validationErrors={validationErrors}
            />
        </ProtectedRoute>
    );
}