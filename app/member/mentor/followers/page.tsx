"use client";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { API_CONFIG } from "@/app/config/global";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import FollowersList from "@/app/member/mentor/followers/FollowersList";
import FollowersSearch from "@/app/member/mentor/followers/FollowersSearch";
import { Follower } from '@/app/types/user.types';

export default function FollowersPage() {
    const { user, logout } = useAuth();
    const [accountDropdownOpen,setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
    const [followers, setFollowers ] = useState<Follower[]>([]);
    const [filteredFollowers, setFilteredFollowers] = useState<Follower[]>([]);

    useEffect((): void  => {
        const fetchFollowers = async (): Promise<void> => {
            if (!user?.id) return;
            try {
                const response = await axios.get(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.follower.getFollowers + user.id}`);

                if (response.data.success) {
                    setFollowers(response.data.data);
                    setFilteredFollowers(response.data.data);
                }
            } catch (error: any) {
                console.error("Błąd przy pobieraniu obserwująch mentora", error);
            }
        };
        fetchFollowers();
    }, [user?.id]);

    const handleSearch = (filtered: Follower[]) : void => {
        setFilteredFollowers(filtered);
    };

    return (
        <ProtectedRoute>
            <Navigation
                activeSection="followers"
                user = {user!}
                handleLogout={logout}
                accountDropdownOpen = {accountDropdownOpen}
                setAccountDropdownOpen={setAccountDropdownOpen}
                notifyDropdownOpen = {notifyDropdownOpen}
                setNotifyDropdownOpen={setNotifyDropdownOpen}
                type="standard"
            />

            <main>
                <section className="pt-20 pb-20">
                    <FollowersSearch followers={followers} onSearch={handleSearch} />
                    <FollowersList followers={filteredFollowers} />
                </section>
            </main>
        </ProtectedRoute>
    );
}