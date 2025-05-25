"use client";
import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import SearchCreatorSteps from "@/app/member/search-creator/SearchCreatorSteps";
import SearchCreatorStage1 from "@/app/member/search-creator/SearchCreatorStage1";
import SearchCreatorStage2 from "@/app/member/search-creator/SearchCreatorStage2";
import SearchCreatorStage3 from "@/app/member/search-creator/SearchCreatorStage3";
import SearchCreatorStage4 from "@/app/member/search-creator/SearchCreatorStage4";
import SearchCreatorStage5 from "@/app/member/search-creator/SearchCreatorStage5";
import SearchCreatorStage6 from "@/app/member/search-creator/SearchCreatorStage6";

export default function SearchCreatorPage() {
    const { user, logout } = useAuth();
    const [ dropdownOpen, setDropdownOpen] = useState(false);
    const [stage, setStage] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
    });

    const nextStage = () => {
        setStage((prev) => prev + 1);
    }

    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    return (
        <ProtectedRoute>
            {user?.account_type === "P" && (
                <>
                    <Navigation
                        activeSection=""
                        user = {user!}
                        handleLogout={logout}
                        dropdownOpen = {dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                        type="standard"
                    />
                    <main className="flex h-[100vh]">
                        <section className="w-2/5 h-full">
                             <SearchCreatorSteps stage = {stage} />
                        </section>

                        <section className="w-1/2 h-full">
                            {stage === 1 &&
                                <SearchCreatorStage1 nextStage={nextStage} />
                            }
                            {stage === 2 &&
                                <SearchCreatorStage2 nextStage={nextStage} />
                            }
                            {stage === 3 &&
                                <SearchCreatorStage3 nextStage={nextStage} />
                            }
                            {stage === 4 &&
                                <SearchCreatorStage4 nextStage={nextStage} />
                            }
                            {stage === 5 &&
                                <SearchCreatorStage5 nextStage={nextStage} />
                            }
                            {stage === 6 &&
                                <SearchCreatorStage6 nextStage={nextStage} />
                            }
                        </section>
                    </main>
                </>
            )}
        </ProtectedRoute>
    );
}
