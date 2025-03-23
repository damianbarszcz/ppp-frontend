"use client";
import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import MentorHome from "@/app/member/home/MentorHome";
import ProspectorHome from "@/app/member/home/ProspectorHome";

export default function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <ProtectedRoute>
            {user?.account_type === "M" ? (
                <MentorHome handleLogout={logout} user={user!} />
            ) : (
                <ProspectorHome handleLogout={logout} user={user!} />
            )}
        </ProtectedRoute>
    );
}
