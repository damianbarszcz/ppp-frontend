"use client";
import React, {useState} from "react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import ChatPanel from "@/app/member/channels/channel/ChatPanel";
import ActionsPanel from "@/app/member/channels/channel/ActionsPanel";
import ParticipantsPanel from "@/app/member/channels/channel/ParticipantsPanel";

export default function SingleChannelPage() {
    const {user, logout} = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleMessage = async (e: React.FormEvent) => {
        e.preventDefault();
    }

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
                        type="channel"
                    />

                    <main className="h-full pt-3 pb-3 pr-10 pl-10">
                        <div className="grid grid-cols-12 grid-rows-4 gap-x-20 gap-y-10 h-full max-h-[90%]">
                            <ParticipantsPanel user = {user!} />
                            <ChatPanel handleMessage = {handleMessage} message ={message} setMessage={setMessage} />
                            <ActionsPanel />
                        </div>
                    </main>
                </>
            )}
        </ProtectedRoute>
    );
}