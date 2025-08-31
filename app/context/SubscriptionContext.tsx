"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@/app/config/global';
import { useAuth } from '@/app/context/AuthContext';

interface SubscriptionData {
    hasMentorPlus: boolean;
    status: string | null;
    amount: number | null;
    currency: string | null;
    expiresAt: string | null;
    daysRemaining: number | null;
    currentSubscription: any;
    allPayments: any[];
    paymentCount: number;
}

interface SubscriptionContextType {
    hasMentorPlus: boolean;
    subscriptionData: SubscriptionData | null;
    refreshSubscriptionData: () => Promise<void>;
}

interface SubscriptionProviderProps {
    children: ReactNode;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);

    const refreshSubscriptionData = async (): Promise<void> => {
        if (!user?.id) {
            setSubscriptionData(null);
            return;
        }
        try {
            const response = await axios.get(`${API_CONFIG.baseUrl}/api/payments/user/${user.id}/status`);
            const data = response.data.data;
            setSubscriptionData(data);

        } catch (error) {
            setSubscriptionData({
                hasMentorPlus: false,
                status: null,
                amount: null,
                currency: null,
                expiresAt: null,
                daysRemaining: null,
                currentSubscription: null,
                allPayments: [],
                paymentCount: 0
            });
        }
    };

    useEffect(() => {
        if (user?.id) {
            refreshSubscriptionData();
        } else {
            setSubscriptionData(null);
        }
    }, [user?.id]);

    const contextValue: SubscriptionContextType = {
        hasMentorPlus: subscriptionData?.hasMentorPlus || false,
        subscriptionData,
        refreshSubscriptionData,
    };

    return (
        <SubscriptionContext.Provider value={contextValue}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = (): SubscriptionContextType => {
    return useContext(SubscriptionContext) as SubscriptionContextType;
};