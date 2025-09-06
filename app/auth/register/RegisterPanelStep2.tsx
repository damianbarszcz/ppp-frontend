"use client";
import React from "react";
import Button from "@/app/components/ui/Button";
import {RegisterPanelStep2Props} from "@/app/types";

const RegisterPanelStep2: React.FC<RegisterPanelStep2Props> = ({ nextStep, updateFormData, formData, roleError } : RegisterPanelStep2Props) => {

    return (
        <div className="m-auto">
            <form onSubmit={nextStep} className="mt-10 w-full">
                <div className="flex gap-4 m-auto max-w-2xl">

                    <div className={`${formData.account_type === "P" ? "border border-app-blue" : "border border-app-anthracite"} p-5 rounded-md cursor-pointer flex-1 h-96`}
                         onClick={() => updateFormData({ account_type: "P"})}>
                        <h3 className="text-xl font-semibold text-app-white">Poszukiwacz</h3>
                        <p className="mt-3 font-medium text-base text-app-light-silver">Znajdź partnera do zespołu</p>
                        <ul className="text-xs mt-5">
                            <li className="text-app-light-silver text-sm mb-3">✓ Dostęp do kreatora poszukiwań</li>
                            <li className="text-app-light-silver text-sm mb-3">✓ Subskrybowanie i obserwowanie mentorów</li>
                            <li className="text-app-light-silver text-sm mb-3">✓ Tworzenie kanału zespołowego</li>
                            <li className="text-app-light-silver text-sm mb-3">✓ Dostęp do czatu tekstowego i wideo</li>
                            <li className="text-app-light-silver text-sm mb-3">✓ Dodawanie partnerów do kanału</li>
                            <li className="text-app-light-silver text-sm mb-3">✓ Ręczne wyszukiwanie mentorów</li>
                        </ul>
                    </div>

                    <div className={`${formData.account_type === "M" ? "border border-app-blue" : "border border-app-anthracite"} p-5 rounded-md cursor-pointer flex-1 h-96`}
                         onClick={() => updateFormData({ account_type: "M"})}>
                        <h3 className="text-xl font-semibold text-app-white">Mentor</h3>
                        <p className="mt-3 font-medium text-base text-app-light-silver">Konto dla ekspertów w swoich dziedzinach</p>
                        <ul className="text-xs mt-5">
                            <li className="text-app-light-silver text-sm mb-3">✓ Publikacja materiałów w formie mikrobloga</li>
                            <li className="text-app-light-silver text-sm mb-3">✓ Tworzenie treści płatnych i bezpłatnych</li>
                            <li className="text-app-light-silver text-sm mb-3">✓ Przeglądanie listy obserwatorów</li>
                            <li className="text-app-light-silver text-sm mb-3">✓ Lepsze docieranie do odbiorców dzięki funkcjonalności pozycjonowania</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-2 relative m-auto max-w-2xl">
                    { roleError ? <span className="absolute text-left text-sm global--text-error">{roleError}</span> : ''}
                </div>

                <div className="mt-16 m-auto max-w-md">
                    <Button type="submit" uiType="light" size="longSize">Kontynuuj</Button>
                </div>
            </form>
        </div>
    );
}

export default RegisterPanelStep2;