'use client';
import React, { useState } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import RegisterHeader from "@/app/auth/register/RegisterHeader";
import RegisterSteps from "@/app/auth/register/RegisterSteps";
import RegisterPanelStep1 from "@/app/auth/register/RegisterPanelStep1";
import RegisterPanelStep2 from "@/app/auth/register/RegisterPanelStep2";
import RegisterPanelStep3 from "@/app/auth/register/RegisterPanelStep3";
import Brand from "@/app/components/ui/Brand";

export default function RegisterPage()  {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        account_type: "",
    });
    const nextStep = () => setStep((prev) => prev + 1);

    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/api/auth/register", formData);
            if (response.data.success) {
                sessionStorage.setItem('registerMessage', response.data.message);
                router.push(`/auth/login`);
            }
        } catch (error: any) {
            if (error.response) {
                console.log(error.response.data.message);
            }
        }
    };

    return (
        <main className="global--register-theme flex h-[100vh]">
            <section className="h-[96.75vh] w-full m-4">
                <Brand uiType="light"/>
                <RegisterHeader />
                <RegisterSteps step = {step} />
                {step === 1 &&  <RegisterPanelStep1
                    formData={formData}
                    nextStep={nextStep}
                    updateFormData={updateFormData}
                /> }
                {step === 2 &&  <RegisterPanelStep2
                    formData={formData}
                    nextStep={nextStep}
                    updateFormData={updateFormData}
                /> }

                {step === 3 &&  <RegisterPanelStep3
                    formData={formData}
                    handleRegister={handleRegister}
                /> }

                <div className="text-center mt-10 flex justify-center">
                    <p className="text-base font-body global--text-d-silver">Masz już konto?</p>
                    <a href="/auth/login" className="global--text-white ml-2 text-base font-body" target="_self">Zaloguj się</a>
                </div>
            </section>
        </main>
    );
}
