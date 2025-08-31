"use client"
import React, {useEffect, useState} from "react";
import axios from "axios";
import LoginBanner from "./LoginBanner";
import LoginPanel from "./LoginPanel";
import Message from "@/app/components/ui/Message";
import PublicRoute from "@/app/routes/public/PublicRoute";
import {API_CONFIG} from "@/app/config/global";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg_success, setMsgSuccess] = useState('');
    const [msg_error, setMsgError] = useState('');
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        const msg_success = sessionStorage.getItem('registerMessage');
        if (msg_success) {
            setMsgSuccess(msg_success);
            sessionStorage.removeItem('registerMessage');
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsgSuccess('');
        setMsgError('');
        setEmailError('');
        setPasswordError('');
        let hasError = false;

        if (!email) {
            setEmailError("Musisz podać adres email.");
            hasError = true;
        }
        if (!password) {
            setPasswordError("Musisz podać hasło.");
            hasError = true;
        }

        if (hasError) return;

        try {
            const response = await axios.post(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.handleLogin}`,
                { email, password }, { withCredentials: true }
            );

            if (response.data.success) {
                setEmail('');
                setPassword('');

                const accountType = response.data.account_type;

                if (accountType === 'M') {
                    window.location.href = "/member/mentor/home";
                } else {
                   window.location.href = "/member/prospector/home";
                }
            }
        } catch (error: any) {
            setPassword('');

            if (error.response) {
                setMsgError(error.response.data.message);
            }
        }
    };

    return (
        <PublicRoute>
            { msg_error && ( <Message message ={msg_error} type="error"/> )}
            { msg_success && ( <Message message ={msg_success} type="success" /> )}

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
                        emailError = {emailError}
                        passwordError = {passwordError}
                    />
                </section>
            </main>
        </PublicRoute>
    );
}