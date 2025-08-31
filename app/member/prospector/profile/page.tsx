"use client";
import React, {useState} from "react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [ dropdownOpen, setDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);

    return (
        <ProtectedRoute>
            {user?.account_type === "P" && (
                <>
                    <Navigation
                        activeSection=""
                        user = {user!}
                        handleLogout={logout}
                        dropdownOpen = {dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                        notifyDropdownOpen = {notifyDropdownOpen}
                        setNotifyDropdownOpen={setNotifyDropdownOpen}
                        type="standard"
                    />
                </>
            )}
        </ProtectedRoute>
    );
}