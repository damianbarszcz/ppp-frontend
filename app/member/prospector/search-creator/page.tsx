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
import SearchCreatorStage5 from "./SearchCreatorStage5";
import SearchCreatorStage6 from "./SearchCreatorStage6";
import RecommendedPeopleList from "./RecommendedPeopleList";

interface SearchFormData {
    // Stage 2 - obszary współpracy
    collaborationAreas: string[];

    // Stage 3 - preferencje współpracy
    meetingFrequency: string;
    sessionLength: string;
    timePreferences: string[];
    workStyles: string[];

    // Stage 4 - kompetencje i doświadczenie
    experienceLevel: string;
    industries: string[];
    requiredSkills: string[];
    languages: string[];

    // Stage 5 - format współpracy
    projectType: string;
    timeCommitment: string;
    workModes: string[];
    budgetRange: string;
    location: string;

    // Stage 6 - dopasowanie i oczekiwania
    priorities: string[];
    personalityTraits: string[];
    specificRequirements: string[];
    dealBreakers: string[];
    additionalNotes: string;

    // Stare pola do usunięcia po migracji
    lookingFor: string[];
}

export default function SearchCreatorPage() {
    const { user, logout } = useAuth();
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
    const [stage, setStage] = useState(1);

    const [formData, setFormData] = useState<SearchFormData>({
        // Stage 2
        collaborationAreas: [],

        // Stage 3
        meetingFrequency: '',
        sessionLength: '',
        timePreferences: [],
        workStyles: [],

        // Stage 4
        experienceLevel: '',
        industries: [],
        requiredSkills: [],
        languages: [],

        // Stage 5
        projectType: '',
        timeCommitment: '',
        workModes: [],
        budgetRange: '',
        location: '',

        // Stage 6
        priorities: [],
        personalityTraits: [],
        specificRequirements: [],
        dealBreakers: [],
        additionalNotes: '',

        // Stare pole - do usunięcia
        lookingFor: []
    });

    const nextStage = () => {
        setStage((prev) => prev + 1);
    };

    const updateFormData = (data: Partial<SearchFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
        console.log('Updated formData:', { ...formData, ...data }); // Debug - usuń w produkcji
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
                    <SearchCreatorStage5
                        nextStage={nextStage}
                        updateFormData={updateFormData}
                        formData={formData}
                    />
                );
            case 6:
                return (
                    <SearchCreatorStage6
                        nextStage={nextStage}
                        updateFormData={updateFormData}
                        formData={formData}
                    />
                );
            case 7:
                return (
                    <RecommendedPeopleList />
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
                {stage !== 7 && (
                    <section className="w-2/5 h-full">
                        <SearchCreatorSteps stage={stage} />
                    </section>
                )}

                <section className={`${stage === 7 ? 'w-full' : 'w-3/5'} h-full overflow-y-auto`}>
                    {renderCurrentStage()}
                </section>
            </main>
        </ProtectedRoute>
    );
}