"use client";
import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import SearchCreatorSteps from "./SearchCreatorSteps";
import SearchCreatorStage1 from "./SearchCreatorStage1";
import SearchCreatorStage2 from "./SearchCreatorStage2";
import SearchCreatorStage3 from "./SearchCreatorStage3";
import SearchCreatorStage4 from "./SearchCreatorStage4";
import RecommendedPeopleList from "./RecommendedPeopleList";
import {SearchFormData} from "@/app/types";

export default function SearchCreatorPage() {
    const { user, logout } = useAuth();
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
    const [stage, setStage] = useState(1);

    const [formData, setFormData] = useState<SearchFormData>({
        collaboration_areas: [],
        experience_level: '',
        industries: [],
        required_skills: [],
        project_type: '',
        time_commitment: '',
        work_modes: [],
        budget_range: '',
        location: '',
        additional_notes: ''
    });

    const nextStage = () => {
        setStage((prev) => prev + 1);
    };

    const resetSearch = () => {
        setStage(1);
        setFormData({
            collaboration_areas: [],
            experience_level: '',
            industries: [],
            required_skills: [],
            project_type: '',
            time_commitment: '',
            work_modes: [],
            budget_range: '',
            location: '',
            additional_notes: ''
        });

        sessionStorage.removeItem('searchResults');
        sessionStorage.removeItem('searchId');
        sessionStorage.removeItem('searchCriteria');
        sessionStorage.removeItem('searchError');
    };

    const updateFormData = (data: Partial<SearchFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const renderCurrentStage = () => {
        switch (stage) {
            case 1:
                return <SearchCreatorStage1 nextStage={nextStage} />;
            case 2:
                return (
                    <SearchCreatorStage2
                        nextStage={nextStage}
                        updateFormData={updateFormData}
                        formData={formData}
                    />
                );
            case 3:
                return (
                    <SearchCreatorStage3
                        nextStage={nextStage}
                        updateFormData={updateFormData}
                        formData={formData}
                    />
                );
            case 4:
                return (
                    <SearchCreatorStage4
                        nextStage={nextStage}
                        updateFormData={updateFormData}
                        formData={formData}
                    />
                );
            case 5:
                return (
                    <RecommendedPeopleList onRestartSearch={resetSearch} />
                );
            default:
                return <SearchCreatorStage1 nextStage={nextStage} />;
        }
    };

    return (
        <ProtectedRoute>
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
            <main className="flex h-[100vh]">
                {stage !== 5 && (
                    <section className="w-2/5 h-full">
                        <SearchCreatorSteps stage={stage} />
                    </section>
                )}

                <section className={`${stage === 5 ? 'w-full' : 'w-3/5'} h-full overflow-y-auto`}>
                    {renderCurrentStage()}
                </section>
            </main>
        </ProtectedRoute>
    );
}