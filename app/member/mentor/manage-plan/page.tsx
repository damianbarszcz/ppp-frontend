"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { API_CONFIG } from "@/app/config/global";
import { getStripe } from "@/app/config/stripe";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import ManagePlanHeader from "@/app/member/mentor/manage-plan/ManagePlanHeader";
import ManagePlanPricing from "@/app/member/mentor/manage-plan/ManagePlanPricing";

export default function  ManagePlanPage() {
    const { user } = useAuth();
    const router = useRouter();

    const handleGoBack = () : void => {
        router.back();
    };

    const handleSubscribe = async () : Promise<void> => {
        if (!user?.id) return;

        try {
            const response = await axios.post(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.managePlan.createMentorPlusSession}`,
                {user_id: user.id});

            const { sessionId } = response.data.data;
            const stripe = await getStripe();
            if (!stripe) {
                console.error('Stripe nie został załadowany');
                return;
            }
            const { error } = await stripe.redirectToCheckout({ sessionId: sessionId });
            if (error) {
                console.error('Stripe error:', error);
            }
        } catch (error) {
            console.error('Błąd przy tworzeniu sesji płatności:', error);
        }
    };

    return (
        <ProtectedRoute>
            <div className="absolute ml-5 mt-5">
                <button type="button" className="rounded-full w-12 h-12 global--border-silver text-center" onClick={handleGoBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="m-auto global--fill-white" viewBox="0 0 256 256">
                        <path d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z"></path>
                    </svg>
                </button>
            </div>

            <main className="global--bg-black flex flex-col justify-start items-center h-[100vh]">
                <ManagePlanHeader />
                <ManagePlanPricing handleSubscribe = {handleSubscribe} />
            </main>
        </ProtectedRoute>
    );
}
