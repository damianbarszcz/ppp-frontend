"use client";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import MentorDashboard from "@/app/member/dashboard/MentorDashboard";
import ProspectorDashboard from "@/app/member/dashboard/ProspectorDashboard";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/auth/me", { withCredentials: true });
                console.log("✔️ Dane użytkownika:", response.data); // 🔍
                setUser(response.data.user);
            } catch (error) {
                console.error("Błąd pobierania użytkownika:", error);
                router.push("/auth/login");
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:8000/api/auth/logout",{}, { withCredentials: true });
            router.push("/auth/login");
        } catch (error: any) {
            console.error("Błąd wylogowania:", error);
        }
    }

    return (
        <main>
            {user.account_type === "M" ? (
                <MentorDashboard handleLogout={handleLogout} />
            ) : (
                <ProspectorDashboard handleLogout={handleLogout} />
            )}
        </main>
    );
}
