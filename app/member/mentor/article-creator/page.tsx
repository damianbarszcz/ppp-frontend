"use client";
import React, {useState} from "react";
import axios from "axios";
import { API_CONFIG } from "@/app/config/global";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import ArticleCreatorForm from "@/app/member/mentor/article-creator/ArticleCreatorForm";
import {ArticleValidationError}  from '@/app/types/article.types';
import {ArticleValidationFrontendError} from "@/app/types";

export default function ArticleCreatorPage() {
    const router = useRouter();
    const {user, logout} = useAuth();
    const [accountDropdownOpen,setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
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

    const clearAllErrors = () : void => {
        setValidationErrors({
            titleError: "",
            summaryError: "",
            thumbnailUrlError: "",
            contentError: ""
        });
    };

    const getValidationErrors = (errors: ArticleValidationError[]): void => {
            clearAllErrors();

        const newErrors: ArticleValidationFrontendError = {
            titleError: "",
            summaryError: "",
            thumbnailUrlError: "",
            contentError: ""
        };

            errors.forEach((error) : void => {
                switch (error.field) {
                    case 'title':
                        newErrors.titleError = error.message;
                        break;
                    case 'summary':
                        newErrors.summaryError = error.message;
                        break;
                    case 'thumbnail_url':
                        newErrors.thumbnailUrlError = error.message;
                        break;
                    case 'content':
                        newErrors.contentError = error.message;
                        break;
                    default:
                }
            });

            setValidationErrors(newErrors);
    };

    const createArticle = async (e: React.FormEvent) : Promise<void> => {
        e.preventDefault();

        if(!user?.id)  return
        clearAllErrors();

        try {
            const response = await axios.post(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.article.createArticle}`, {
                    title, content, summary, content_type: contentType, thumbnail_url: thumbnailUrl, user_id: user.id,
                }
            );

            if (response.data.success) {
                setTitle('');
                setSummary('');
                setContent('');
                setThumbnailUrl('');
                setContentType('free');

                sessionStorage.setItem('articleSuccessMessage', response.data.message);
                router.push(`/member/mentor/home`);
            }
        } catch (error: any) {
            if (error.response?.status === 422 && error.response?.data?.errors) {
                getValidationErrors(error.response.data.errors);
            } else if (error.response?.status === 400 && error.response?.data?.errors) {
                getValidationErrors(error.response.data.errors);
            } else {
                console.error('Wystąpił błąd:', error.message);
            }
        }
    }

    return (
        <ProtectedRoute>
            <Navigation
                activeSection="article-creator"
                user = {user!}
                handleLogout={logout}
                accountDropdownOpen = {accountDropdownOpen}
                setAccountDropdownOpen={setAccountDropdownOpen}
                notifyDropdownOpen = {notifyDropdownOpen}
                setNotifyDropdownOpen={setNotifyDropdownOpen}
                type="standard"
            />

            <main>
                <ArticleCreatorForm
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
                    createArticle={createArticle}
                    validationErrors={validationErrors}
                />
            </main>
        </ProtectedRoute>
    );
}