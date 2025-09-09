"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";
import { API_CONFIG } from "@/app/config/global";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import ProfileCreatorForm from "./ProfileCreatorForm";
import Message from "@/app/components/ui/Message";

import {
    ProfileCreatorValidationFrontendError,
    ValidationError,
    ProspectorProfileFormData
} from "@/app/types";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
    const [msgSuccess, setMsgSuccess] = useState('');
    const [profileExists, setProfileExists] = useState(false);
    const [_profileId, setProfileId] = useState<number | null>(null);

    const [formData, setFormData] = useState<ProspectorProfileFormData>({
        aboutMe: "",
        specialization: "",
        location: "",
        collaborationAreas: [],
        experienceLevel: "",
        industries: [],
        requiredSkills: [],
        projectType: "",
        timeCommitment: "",
        workModes: [],
        budgetRange: "",
        availabilityStatus: "active",
        additionalNotes: ""
    });

    const [validationErrors, setValidationErrors] = useState<ProfileCreatorValidationFrontendError>({
        aboutMeError: "",
        specializationError: "",
        collaborationAreasError: "",
        experienceLevelError: "",
        industriesError: "",
        projectTypeError: "",
        timeCommitmentError: "",
        workModesError: "",
        budgetRangeError: "",
    });

    useEffect(() => {
        const msgSuccessBox = sessionStorage.getItem('profileCreateSuccessMessage');
        if (msgSuccessBox) {
            setMsgSuccess(msgSuccessBox);
            sessionStorage.removeItem('profileCreateSuccessMessage');
        }
    }, []);

    useEffect(() => {
        const fetchProspectorProfile = async () => {
            if (!user?.id) return;
            try {
                const response = await axios.get(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.profile.getProspectorProfile + user.id}`);

                if (response.data.success && response.data.data) {
                    const profileData = response.data.data;

                    setFormData({
                        aboutMe: profileData.about_me || "",
                        specialization: profileData.specialization || "",
                        location: profileData.location || "",
                        collaborationAreas: profileData.collaboration_areas || [],
                        experienceLevel: profileData.experience_level || "",
                        industries: profileData.industries || [],
                        requiredSkills: profileData.required_skills || [],
                        projectType: profileData.project_type || "",
                        timeCommitment: profileData.time_commitment || "",
                        workModes: profileData.work_modes || [],
                        budgetRange: profileData.budget_range || "",
                        availabilityStatus: profileData.availability_status || "active",
                        additionalNotes: profileData.additional_notes || ""
                    });

                    setProfileExists(true);
                    setProfileId(profileData.id);
                }
            } catch (error) {
                if (error.response?.status === 422 && error.response?.data?.errors) {
                    setProfileExists(false);
                } else {
                    console.error('Błąd podczas ładowania profilu:', error);
                }
            }
        };

        fetchProspectorProfile();
    }, [user?.id]);

    const updateFormData = (data: Partial<ProspectorProfileFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const clearAllErrors = () => {
        setValidationErrors({
            aboutMeError: "",
            specializationError: "",
            collaborationAreasError: "",
            experienceLevelError: "",
            industriesError: "",
            projectTypeError: "",
            timeCommitmentError: "",
            workModesError: "",
            budgetRangeError: "",
        });
    };

    const getValidationErrors = (errors: ValidationError[]) => {
        clearAllErrors();
        const newErrors: ProfileCreatorValidationFrontendError = {
            aboutMeError: "",
            specializationError: "",
            collaborationAreasError: "",
            experienceLevelError: "",
            industriesError: "",
            projectTypeError: "",
            timeCommitmentError: "",
            workModesError: "",
            budgetRangeError: "",
        };

        errors.forEach((error) => {
            switch (error.field) {
                case 'about_me':
                    newErrors.aboutMeError = error.message;
                    break;
                case 'specialization':
                    newErrors.specializationError = error.message;
                    break;
                case 'collaboration_areas':
                    newErrors.collaborationAreasError = error.message;
                    break;
                case 'experience_level':
                    newErrors.experienceLevelError = error.message;
                    break;
                case 'industries':
                    newErrors.industriesError = error.message;
                    break;
                case 'project_type':
                    newErrors.projectTypeError = error.message;
                    break;
                case 'time_commitment':
                    newErrors.timeCommitmentError = error.message;
                    break;
                case 'work_modes':
                    newErrors.workModesError = error.message;
                    break;
                case 'budget_range':
                    newErrors.budgetRangeError = error.message;
                    break;
            }
        });
        setValidationErrors(newErrors);
    };

    const publishProspectorProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        try {
            const apiData = {
                user_id: user.id,
                about_me: formData.aboutMe,
                specialization: formData.specialization,
                location: formData.location,
                collaboration_areas: formData.collaborationAreas,
                experience_level: formData.experienceLevel,
                industries: formData.industries,
                required_skills: formData.requiredSkills,
                project_type: formData.projectType,
                time_commitment: formData.timeCommitment,
                work_modes: formData.workModes,
                budget_range: formData.budgetRange,
                availability_status: formData.availabilityStatus,
                additional_notes: formData.additionalNotes
            };

            let response;
            if (profileExists) {
                response = await axios.put(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.profile.updateProspectorProfile + user.id}`,
                    apiData
                );
            } else {
                response = await axios.post(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.profile.publishProspectorProfile}`,
                    apiData
                );
            }

            if (response.data.success) {
                clearAllErrors();

                const successMessage = profileExists
                    ? 'Profil został pomyślnie zaktualizowany!'
                    : response.data.message;

                sessionStorage.setItem('profileCreateSuccessMessage', successMessage);

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
                activeSection=""
                user={user!}
                handleLogout={logout}
                accountDropdownOpen={accountDropdownOpen}
                setAccountDropdownOpen={setAccountDropdownOpen}
                notifyDropdownOpen={notifyDropdownOpen}
                setNotifyDropdownOpen={setNotifyDropdownOpen}
                type="standard"
            />

            <ProfileCreatorForm
                formData={formData}
                updateFormData={updateFormData}
                publishProspectorProfile={publishProspectorProfile}
                validationErrors={validationErrors}
            />
        </ProtectedRoute>
    );
}