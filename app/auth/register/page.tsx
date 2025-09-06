'use client';
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import {API_CONFIG} from "@/app/config/global";
import {useRouter} from "next/navigation";
import PublicRoute from "@/app/routes/public/PublicRoute";
import RegisterHeader from "@/app/auth/register/RegisterHeader";
import RegisterSteps from "@/app/auth/register/RegisterSteps";
import RegisterPanelStep1 from "@/app/auth/register/RegisterPanelStep1";
import RegisterPanelStep2 from "@/app/auth/register/RegisterPanelStep2";
import RegisterPanelStep3 from "@/app/auth/register/RegisterPanelStep3";
import Brand from "@/app/components/ui/Brand";
import Message from "@/app/components/ui/Message";
import {RegisterValidationError, ValidationError} from "@/app/types";

export default function RegisterPage()  {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [msgError, setMsgError] = useState('');
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        account_type: "",
    });
    const [validationErrors, setValidationErrors] = useState<RegisterValidationError>({
        nameError: "",
        surnameError: "",
        emailError: "",
        passwordError: "",
        accountTypeError: "",
    });

    const clearAllErrors = (): void => {
        setValidationErrors({
            nameError: "",
            surnameError: "",
            emailError: "",
            passwordError: "",
            accountTypeError: ""
        });
        setMsgError("");
    };

    const getValidationErrors = (errors: ValidationError[]): void => {
        clearAllErrors();
        const newErrors: RegisterValidationError = {
            nameError: "",
            surnameError: "",
            emailError: "",
            passwordError: "",
            accountTypeError: ""
        };

        errors.forEach((error): void => {
            switch (error.field) {
                case 'name':
                    newErrors.nameError = error.message;
                    break;
                case 'surname':
                    newErrors.surnameError = error.message;
                    break;
                case 'email':
                    newErrors.emailError = error.message;
                    break;
                case 'password':
                    newErrors.passwordError = error.message;
                    break;
                case 'account_type':
                    newErrors.accountTypeError = error.message;
                    break;
                default:
                    break;
            }
        });
        setValidationErrors(newErrors);
    };

    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const handleRegister = async (e: React.FormEvent, currentStep: number = step) => {
        e.preventDefault();
        clearAllErrors();

        try {
            let dataToValidate = {};
            let endpoint = '';

            switch (currentStep) {
                case 1:
                    dataToValidate = {
                        name: formData.name,
                        surname: formData.surname,
                        email: formData.email,
                        password: formData.password
                    };
                    endpoint = API_CONFIG.endpoints.auth.handleRegisterStep1;
                    break;

                case 2:
                    dataToValidate = {
                        account_type: formData.account_type
                    };
                    endpoint = API_CONFIG.endpoints.auth.handleRegisterStep2;
                    break;

                case 3:
                    dataToValidate = formData;
                    endpoint = API_CONFIG.endpoints.auth.handleRegister;
                    break;

                default:
                    return;
            }

            const response = await axios.post(`${API_CONFIG.baseUrl}${endpoint}`, dataToValidate);

            if (response.data.success) {
                if (currentStep < 3) {
                    setStep(currentStep + 1);
                } else {
                    sessionStorage.setItem('registerMessage', response.data.message);
                    router.push('/auth/login');
                }
            }

        } catch (error: any) {
            if (error.response?.status === 422 && error.response?.data?.errors) {
                getValidationErrors(error.response.data.errors);
            } else if (error.response?.status === 409 && currentStep === 3) {
                setStep(1);
                getValidationErrors(error.response.data.errors || []);
            } else {
                setMsgError(error.response?.data?.message || "Wystąpił błąd podczas rejestracji.");
            }
        }
    };

    return (
        <PublicRoute>
            { msgError && ( <Message message ={msgError} type="error"/> )}

            <main className="global--register-theme flex h-[100vh]">
                <section className="h-[96.75vh] w-full m-4">
                    <Brand uiType="light"/>
                    <RegisterHeader />
                    <RegisterSteps step = {step} />

                    {step === 1 &&  <RegisterPanelStep1
                        formData={formData}
                        nextStep={(e) => handleRegister(e, 1)}
                        updateFormData={updateFormData}
                        nameError={validationErrors.nameError}
                        surnameError={validationErrors.surnameError}
                        emailError={validationErrors.emailError}
                        passwordError={validationErrors.passwordError}
                    /> }

                    {step === 2 &&  <RegisterPanelStep2
                        formData={formData}
                        nextStep={(e) => handleRegister(e, 2)}
                        updateFormData={updateFormData}
                        roleError={validationErrors.accountTypeError}
                    /> }

                    {step === 3 &&  <RegisterPanelStep3
                        formData={formData}
                        handleRegister={(e) => handleRegister(e, 3)}
                    /> }

                    <div className="text-center mt-10 flex justify-center">
                        <p className="text-base text-app-light-silver">Masz już konto?</p>
                        <Link href="/auth/login" className="text-app-white ml-2 text-base font-semibold" target="_self">Zaloguj się</Link>
                    </div>
                </section>
            </main>
        </PublicRoute>
    );
}