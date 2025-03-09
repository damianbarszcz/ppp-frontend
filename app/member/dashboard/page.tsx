"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MentorDashboard from "@/app/member/dashboard/MentorDashboard";
import ProspectorDashboard from "@/app/member/dashboard/ProspectorDashboard";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/auth/me", { withCredentials: true });
                if (!response.data.user) {
                    throw new Error("Użytkownik nie znaleziony.");
                }
                setUser(response.data.user);
            } catch (error) {
                router.push("/auth/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return <p>Ładowanie danych użytkownika...</p>;
    }
    if (!user) {
        return <p>Nie znaleziono użytkownika. Przekierowanie...</p>;
    }

    const handleLogout = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Wylogowanie");
        try {
            await axios.post("http://localhost:8000/api/auth/logout",{}, { withCredentials: true });
            router.push("/auth/login");
        } catch (error: any) {
            console.error("Błąd wylogowania:", error);
        }
    }

    return (
        <main>
            {user.account_type == 'M' ? (
                <MentorDashboard handleLogout={handleLogout} user ={ user } />
            ) : (
                <ProspectorDashboard handleLogout={handleLogout} user ={ user } />
            )}
        </main>
    );
}
