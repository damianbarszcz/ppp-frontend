"use client";
import React, {useState} from "react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import MentorProfileStarter from "@/app/member/mentor/mentor-profile/MentorProfileStarter";
import MentorProfileForm from "@/app/member/mentor/mentor-profile/MentorProfileForm";
import {ArticleValidationFrontendError} from "@/app/types";

export default function MentorProfilePage() {
    const [accountDropdownOpen,setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
    const {user, logout} = useAuth();
    const [isExist, setIsExist] = useState(false);
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [content, setContent] = useState("");
    const [contentType, setContentType] = useState<'free' | 'paid'>('free');

    const [validationErrors, setValidationErrors] = useState<ArticleValidationFrontendError>({
        titleError: "",
        summaryError: "",
        thumbnailUrlError: "",
        contentError: ""
    });

    const createProfile = async (e: React.FormEvent) : Promise<void> => {}

    return (
        <ProtectedRoute>
            <Navigation
                activeSection="mentor-profile"
                user = {user!}
                handleLogout={logout}
                accountDropdownOpen = {accountDropdownOpen}
                setAccountDropdownOpen={setAccountDropdownOpen}
                notifyDropdownOpen = {notifyDropdownOpen}
                setNotifyDropdownOpen={setNotifyDropdownOpen}
                type="standard"
            />

            <main>
                { isExist ?
                    <MentorProfileForm
                        title={title}
                        setTitle={setTitle}
                        content={content}
                        setContent={setContent}
                        contentType={contentType}
                        setContentType={setContentType}
                        thumbnailUrl={thumbnailUrl}
                        setThumbnailUrl={setThumbnailUrl}
                        summary={summary}
                        setSummary={setSummary}
                        createArticle={createProfile}
                        validationErrors={validationErrors}
                    />
                    :
                    <MentorProfileStarter  setIsExist = {setIsExist} isExist={isExist}/>
                }
            </main>
        </ProtectedRoute>
    );
}