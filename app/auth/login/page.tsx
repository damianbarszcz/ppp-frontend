"use client"
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import LoginBanner from "./LoginBanner";
import LoginPanel from "./LoginPanel";
import Message from "@/app/components/ui/Message";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg_success, setMsgSuccess] = useState('');
    const [msg_error, setMsgError] = useState('');

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

        try {
            const response = await axios.post("http://localhost:8000/api/auth/login", { email, password }, { withCredentials: true });
            console.log("Odpowiedź serwera:", response.data);
            if (response.data.success) {
                router.push("/member/dashboard");
            }
        } catch (error: any) {
            if (error.response) {
                setMsgError(error.response.data.message);
            }
        }
    };

    return (
        <>
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
                    />
                </section>
            </main>
        </>
    );
}