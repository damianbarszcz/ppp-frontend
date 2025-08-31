"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from '@/app/types/user.types';
import { useRouter } from "next/navigation";
import axios from "axios";
import {API_CONFIG} from "@/app/config/global";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => {},
    setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API_CONFIG.baseUrl}/api/auth/me`, {
                    withCredentials: true,
                });
                setUser(res.data?.user ?? null);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await axios.post(`${API_CONFIG.baseUrl}/api/auth/logout`, {}, { withCredentials: true });
            setUser(null);
            router.replace("/auth/login");
        } catch (error) {
            console.error("Błąd podczas wylogowania:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};