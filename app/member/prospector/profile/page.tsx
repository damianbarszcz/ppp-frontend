"use client";
import React, {useEffect, useState} from "react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import ProfileCreatorForm from "@/app/member/prospector/profile/ProfileCreatorForm";
import axios from "axios";
import {API_CONFIG} from "@/app/config/global";
import {ProfileCreatorValidationFrontendError, ValidationError} from "@/app/types";
import Message from "@/app/components/ui/Message";

export default function ProfilePage() {
    const {user, logout} = useAuth();
    const [accountDropdownOpen,setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
    const [aboutMe, setAboutMe] = useState("");
    const [msgSuccess, setMsgSuccess] = useState('');
    const [profileExists, setProfileExists] = useState(false);
    const [profileId, setProfileId] = useState<number | null>(null);

    useEffect(() : void => {
        const msgSuccessBox = sessionStorage.getItem('profileCreateSuccessMessage');
        if (msgSuccessBox) {
            setMsgSuccess(msgSuccessBox);
            sessionStorage.removeItem('profileCreateSuccessMessage');
        }
    }, []);

    useEffect((): void => {
        const fetchProspectorProfile = async (): Promise<void> => {
            if (!user?.id) return;
            try {
                const response = await axios.get(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.profile.getProspectorProfile + user.id}`);

                if (response.data.success && response.data.data) {
                    setAboutMe(response.data.data.about_me);
                    setProfileExists(true);
                    setProfileId(response.data.data.id);
                }
            } catch (error: any) {
                if (error.response?.status === 404) {
                    setProfileExists(false);
                } else {
                    console.error('Błąd podczas ładowania profilu:', error);
                }
            }
        };

        fetchProspectorProfile();
    }, [user?.id]);

    const [validationErrors, setValidationErrors] = useState<ProfileCreatorValidationFrontendError>({
        aboutMeError: "",
    });

    const clearAllErrors = (): void => {
        setValidationErrors({
            aboutMeError: "",
        });
    };

    const getValidationErrors = (errors: ValidationError[]): void => {
        clearAllErrors();
        const newErrors: ProfileCreatorValidationFrontendError = {
            aboutMeError: "",
        };
        errors.forEach((error) : void => {
            switch (error.field) {
                case 'about_me':
                    newErrors.aboutMeError = error.message;
                    break;
            }
        });
        setValidationErrors(newErrors);
    };

    const publishProspectorProfile = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!user?.id) return;

        try {
            let response;
            if (profileExists) {
                response = await axios.put(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.profile.updateProspectorProfile + user.id}`,
                    { about_me: aboutMe, user_id: user.id }
                );
            } else {
                response = await axios.post(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.profile.publishProspectorProfile}`,
                    { about_me: aboutMe, user_id: user.id }
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
        } catch (error: any) {
            if (error.response?.status === 422 && error.response?.data?.errors) {
                getValidationErrors(error.response.data.errors);
            } else {
                console.error('Wystąpił błąd:', error.message);
            }
        }
    };

    return (
        <ProtectedRoute>
            { msgSuccess && ( <Message message ={msgSuccess} type="success" /> )}

            <Navigation
                activeSection=""
                user = {user!}
                handleLogout={logout}
                accountDropdownOpen = {accountDropdownOpen}
                setAccountDropdownOpen={setAccountDropdownOpen}
                notifyDropdownOpen = {notifyDropdownOpen}
                setNotifyDropdownOpen={setNotifyDropdownOpen}
                type="standard"
            />

            <ProfileCreatorForm
                aboutMe={aboutMe}
                setAboutMe={setAboutMe}
                publishProspectorProfile={publishProspectorProfile}
                validationErrors={validationErrors}
            />
        </ProtectedRoute>
    );
}