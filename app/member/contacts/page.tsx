"use client";
import React, {useState} from "react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import ContactList from "@/app/member/contacts/ContactList";
import ContactActions from "@/app/member/contacts/ContactActions";

export default function ContactsPage() {
    const { user, logout } = useAuth();
    const [ dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <ProtectedRoute>
            {user?.account_type === "P" && (
                <>
                    <Navigation
                        activeSection="contacts"
                        user = {user!}
                        handleLogout={logout}
                        dropdownOpen = {dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                        type="standard"
                    />
                    <ContactActions />
                    <ContactList />
                </>
            )}
        </ProtectedRoute>
    );
}