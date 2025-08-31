"use client";
import React, {useState} from "react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import ProspectorHome from "@/app/member/prospector/home/ProspectorHome";
import Navigation from "@/app/components/navigation/Navigation";

export default function HomePage() {
    const {user, logout} = useAuth();
    const [accountDropdownOpen,setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);

    return (
        <ProtectedRoute>
            <Navigation
                activeSection="home"
                user = {user!}
                handleLogout={logout}
                accountDropdownOpen = {accountDropdownOpen}
                setAccountDropdownOpen={setAccountDropdownOpen}
                notifyDropdownOpen = {notifyDropdownOpen}
                setNotifyDropdownOpen={setNotifyDropdownOpen}
                type="standard"
            />

            <ProspectorHome user={user!} />
        </ProtectedRoute>
    );
}
