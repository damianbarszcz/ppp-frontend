"use client";
import React, {Suspense, useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import axios from "axios";
import {API_CONFIG} from "@/app/config/global";
import Loader from "@/app/components/ui/Loader";
import PaymentProcessLoading from "./PaymentProcessLoading";
import PaymentProcessError from "./PaymentProcessError";
import PaymentProcessSuccess from "./PaymentProcessSuccess";

function PaymentProcessContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [username, setUsername] = useState<string>('');

    useEffect(() : void  => {
        const sessionId = searchParams.get('session_id');
        const mentorUsername = searchParams.get('username');
        if (mentorUsername) {
            setUsername(mentorUsername);
        }

        if (sessionId) {
            handlePayment(sessionId);
        } else {
            setStatus('error');
        }
    }, [searchParams]);

    const handlePayment = async (sessionId: string) : Promise<void> => {
        try {
            const response = await axios.post(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.managePlan.handlePayment}`,
                { session_id: sessionId }
            );
            if (response.data.success) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    const handleGoBack = (): void => {
        window.location.href = username
            ? `/member/prospector/mentor-search?username=${username}`
            : '/member/prospector/mentor-search';
    };

    return (
        <main>
            {status === 'loading' && (<PaymentProcessLoading />)}
            {status === 'error' && (<PaymentProcessError handleGoBack={handleGoBack} username={username} />)}
            {status === 'success' && (<PaymentProcessSuccess handleGoBack={handleGoBack} username={username} />)}
        </main>
    );
}

export default function PaymentProcessPage() {
    return (
        <Suspense fallback={<Loader />}>
            <PaymentProcessContent />
        </Suspense>
    );
}