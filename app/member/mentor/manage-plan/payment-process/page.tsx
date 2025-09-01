"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { API_CONFIG } from "@/app/config/global";
import PaymentProcessSuccess from "@/app/member/mentor/manage-plan/payment-process/PaymentProcessSuccess";
import PaymentProcessLoading from "@/app/member/mentor/manage-plan/payment-process/PaymentProcessLoading";
import PaymentProcessError from "@/app/member/mentor/manage-plan/payment-process/PaymentProcessError";

function ProcessLoading() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
    );
}

function PaymentProcessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() : void  => {
        const sessionId = searchParams.get('session_id');
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
        router.push('/member/mentor/home');
    };

    return (
        <main>
            { status === 'loading' && ( <PaymentProcessLoading /> )}
            { status === 'error' && ( <PaymentProcessError  handleGoBack = { handleGoBack } /> )}
            { status === 'success' && ( <PaymentProcessSuccess  handleGoBack = { handleGoBack } /> )}
        </main>
    );
}

export default function PaymentProcessPage() {
    return (
        <Suspense fallback={<ProcessLoading />}>
            <PaymentProcessContent />
        </Suspense>
    );
}