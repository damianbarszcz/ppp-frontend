'use client';
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import {useRouter} from "next/navigation";
import PublicRoute from "@/app/routes/public/PublicRoute";
import RegisterHeader from "@/app/auth/register/RegisterHeader";
import RegisterSteps from "@/app/auth/register/RegisterSteps";
import RegisterPanelStep1 from "@/app/auth/register/RegisterPanelStep1";
import RegisterPanelStep2 from "@/app/auth/register/RegisterPanelStep2";
import RegisterPanelStep3 from "@/app/auth/register/RegisterPanelStep3";
import Brand from "@/app/components/ui/Brand";
import {API_CONFIG} from "@/app/config/global";

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
    const [nameError, setNameError] = useState("");
    const [surnameError, setSurnameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [roleError, setRoleError] = useState("");

    const nextStep = () => {
        let hasError = false;
        setNameError('');
        setSurnameError('');
        setEmailError('');
        setPasswordError('');
        setRoleError('');

        if(step == 1){
            if (!formData.name) {
                setNameError("Podaj swoje imię.");
                hasError = true;
            }
            if (!formData.surname) {
                setSurnameError("Podaj swoje nazwisko.");
                hasError = true;
            }
            if (!formData.email) {
                setEmailError("Podaj adres email.");
                hasError = true;
            }
            if (!formData.password) {
                setPasswordError("Podaj hasło.");
                hasError = true;
            }
        }

        if(step == 2){
            if (!formData.account_type) {
                setRoleError("Musisz wybrać role dla swojego konta.");
                hasError = true;
            }
        }

        if (hasError) return;
        setStep((prev) => prev + 1);
    }

    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.handleRegister}`, formData);
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
        <PublicRoute>
            <main className="global--register-theme flex h-[100vh]">
                <section className="h-[96.75vh] w-full m-4">
                    <Brand uiType="light"/>
                    <RegisterHeader />
                    <RegisterSteps step = {step} />
                    {step === 1 &&  <RegisterPanelStep1
                        formData={formData}
                        nextStep={nextStep}
                        updateFormData={updateFormData}
                        nameError = {nameError}
                        surnameError ={surnameError}
                        emailError ={emailError}
                        passwordError ={passwordError}
                    /> }

                    {step === 2 &&  <RegisterPanelStep2
                        formData={formData}
                        nextStep={nextStep}
                        updateFormData={updateFormData}
                        roleError ={roleError}
                    /> }

                    {step === 3 &&  <RegisterPanelStep3
                        formData={formData}
                        handleRegister={handleRegister}
                    /> }

                    <div className="text-center mt-10 flex justify-center">
                        <p className="text-base font-body global--text-d-silver">Masz już konto?</p>
                        <Link href="/auth/login" className="global--text-white ml-2 text-base font-semibold  font-body" target="_self">Zaloguj się</Link>
                    </div>
                </section>
            </main>
        </PublicRoute>
    );
}
