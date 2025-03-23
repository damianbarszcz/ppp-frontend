"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user === null) {
            router.replace("/auth/login");
        }
    }, [user, loading, router]);

    if (loading || user === null) {
        return <p>Ładowanie...</p>;
    }
    return <>{children}</>;
};

export default ProtectedRoute;