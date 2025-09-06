"use client"
import React, {useEffect, useState} from "react";
import axios from "axios";
import {API_CONFIG} from "@/app/config/global";
import {ValidationError,LoginValidationError} from "@/app/types";
import LoginBanner from "./LoginBanner";
import LoginPanel from "./LoginPanel";
import Message from "@/app/components/ui/Message";
import PublicRoute from "@/app/routes/public/PublicRoute";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msgSuccess, setMsgSuccess] = useState('');
    const [msgError, setMsgError] = useState('');
    const [validationErrors, setValidationErrors] = useState<LoginValidationError>({
        emailError: "",
        passwordError: ""
    });

    useEffect(() => {
        const registerSuccess : string|null = sessionStorage.getItem('registerMessage');
        if (registerSuccess) {
            setMsgSuccess(registerSuccess);
            sessionStorage.removeItem('registerMessage');
        }
    }, []);

    const clearAllErrors = (): void => {
        setValidationErrors({emailError: "", passwordError: ""});
        setMsgError("");
        setMsgSuccess("");
    };

    const getValidationErrors = (errors: ValidationError[]): void => {
        clearAllErrors();
        const newErrors: LoginValidationError = {emailError: "", passwordError: ""};
        errors.forEach((error): void => {
            switch (error.field) {
                case 'email':
                    newErrors.emailError = error.message;
                    break;
                case 'password':
                    newErrors.passwordError = error.message;
                    break;
                default:
                    break;
            }
        });
        setValidationErrors(newErrors);
    };

    const handleLogin = async (e: React.FormEvent) : Promise<void> => {
        e.preventDefault();
        clearAllErrors();

        try {
            const response = await axios.post(
                `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.handleLogin}`,
                { email, password }, { withCredentials: true }
            );

            if (response.data.success) {
                setTimeout(() => {
                    const accountType = response.data.account_type;
                    if (accountType === 'M') {
                        window.location.href = API_CONFIG.mentorHomeUrl;
                    } else {
                        window.location.href = API_CONFIG.prospectorHomeUrl;
                    }
                }, 200);
            }

        } catch (error: any) {
            if (error.response?.status === 422 && error.response?.data?.errors) {
                getValidationErrors(error.response.data.errors);
            } else {
                setMsgError(error.response?.data?.message || "Wystąpił błąd podczas logowania");
            }
        }
    };

    return (
        <PublicRoute>
            { msgError && ( <Message message ={msgError} type="error"/> )}
            { msgSuccess && ( <Message message ={msgSuccess} type="success" /> )}

            <main className="global--login-theme flex h-[96.75vh] m-4">
                <section className="w-1/2 h-full">
                    <LoginBanner />
                </section>

                <section className="w-1/2 h-full relative">
                    <LoginPanel
                        handleLogin = {handleLogin}
                        email = {email}
                        password = {password}
                        setEmail = {setEmail}
                        setPassword = {setPassword}
                        emailError={validationErrors.emailError}
                        passwordError={validationErrors.passwordError}
                    />
                </section>
            </main>
        </PublicRoute>
    );
}