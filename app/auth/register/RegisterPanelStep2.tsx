"use client";
import React from "react";
import Button from "@/app/components/ui/Button";

interface RegisterPanelStep2Props {
    nextStep: () => void;
    updateFormData: (data: Partial<FormDataType>) => void;
    formData: FormDataType;
    roleError: string
}

interface FormDataType {
    account_type: string
}

const RegisterPanelStep2: React.FC<RegisterPanelStep2Props> = ({ nextStep, updateFormData, formData, roleError }) => {

    return (
        <div className="m-auto">
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="mt-10 w-full">
                <div className="flex gap-4 m-auto max-w-2xl">

                    <div className={`${formData.account_type === "P" ? "global--border-blue" : "global--border-anthracite"} p-5 rounded-md cursor-pointer flex-1 h-96`}
                         onClick={() => updateFormData({ account_type: "P"})}>
                        <h3 className="font-heading text-xl font-semibold global--text-white">Poszukiwacz</h3>
                        <p className="mt-3 font-body font-medium text-base global--text-d-silver">Znajdź partnera do zespołu</p>
                        <ul className="text-xs mt-5">
                            <li className="font-body global--text-d-silver text-sm mb-3">✓ Dostęp do kreatora poszukiwań</li>
                            <li className="font-body global--text-d-silver text-sm mb-3">✓ Subskrybowanie i obserwowanie mentorów</li>
                            <li className="font-body global--text-d-silver text-sm mb-3">✓ Tworzenie kanału zespołowego</li>
                            <li className="font-body global--text-d-silver text-sm mb-3">✓ Dostęp do czatu tekstowego i wideo</li>
                            <li className="font-body global--text-d-silver text-sm mb-3">✓ Dodawanie partnerów do kanału</li>
                            <li className="font-body global--text-d-silver text-sm mb-3">✓ Ręczne wyszukiwanie mentorów</li>
                        </ul>
                    </div>

                    <div className={`${formData.account_type === "M" ? "global--border-blue" : "global--border-anthracite"} p-5 rounded-md cursor-pointer flex-1 h-96`}
                         onClick={() => updateFormData({ account_type: "M"})}>
                        <h3 className="font-heading text-xl font-semibold global--text-white">Mentor</h3>
                        <p className="mt-3 font-body font-medium text-base global--text-d-silver">Konto dla ekspertów w swoich dziedzinach</p>
                        <ul className="text-xs mt-5">
                            <li className="font-body global--text-d-silver text-sm mb-3">✓ Publikacja materiałów w formie mikrobloga</li>
                            <li className="font-body global--text-d-silver text-sm mb-3">✓ Tworzenie treści płatnych i bezpłatnych</li>
                            <li className="font-body global--text-d-silver text-sm mb-3">✓ Przeglądanie listy obserwatorów</li>
                            <li className="font-body global--text-d-silver text-sm mb-3">✓ Lepsze docieranie do odbiorców dzięki funkcjonalności pozycjonowania </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-2 relative m-auto max-w-2xl">
                { roleError ? <span className="absolute text-left font-body text-sm global--text-error">{roleError}</span> : ''}
                </div>

                <div className="mt-16 m-auto max-w-md">
                    <Button type="submit" uiType="light">Kontynuuj</Button>
                </div>
            </form>
        </div>
    );
}

export default  RegisterPanelStep2;
