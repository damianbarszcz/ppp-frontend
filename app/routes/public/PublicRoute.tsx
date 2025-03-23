"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace("/member/home");
        }
    }, [user, loading]);

    if (loading) return <p>Ładowanie...</p>;

    return <>{children}</>;
};

export default PublicRoute;