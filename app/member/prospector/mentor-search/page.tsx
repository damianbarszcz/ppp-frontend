"use client";
import React, {useEffect, useState, Suspense} from "react";
import axios from "axios";
import {API_CONFIG} from "@/app/config/global";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import {Mentor} from "@/app/types";
import {useSearchParams} from "next/navigation";
import MentorFinderProperties from "@/app/components/mentor-finder/MentorFinderProperties";
import MentorFinderArticles from "@/app/components/mentor-finder/MentorFinderArticles";
import MentorFinderActions from "@/app/components/mentor-finder/MentorFinderActions";
import {loadStripe} from "@stripe/stripe-js";
import {MentorArticleModal} from "@/app/components/modals";

// Loading component
function SearchLoading() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
    );
}

// Główny komponent z useSearchParams
function MentorSearchContent() {
    const {user, logout} = useAuth();
    const [mentor, setMentor] = useState<Mentor>();
    const [accountDropdownOpen,setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isArticleModalOpen, setArticleModalOpen] = useState(false);
    const searchParams = useSearchParams();
    const username = searchParams.get("username");
    const [isFollowing, setIsFollowing] = useState(false);
    const stripePromise = loadStripe('pk_test_51RooZXBNgF2XAMvXmCamC9F8LimFES2HRfa1PL9Fl4BU7v6a1lCJIWpdDeEnZFsJ5FwMS44L5vZngpwOd2qEOlk300niCmtxar');

    useEffect(() => {
        const fetchMentor = async () => {
            if (!username) return;
            try {
                const response = await axios.get(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.user.fetchMentor + username}`);
                if (response.data.success) {
                    setMentor(response.data.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchMentor();
    }, [username]);

    const handleFollowToggle = async () => {
        if (!user?.id || !mentor || user.id === mentor.id) return;

        try {
            if (isFollowing) {
                await axios.delete(`http://localhost:8000/api/followers/${mentor.id}`, {
                    data: { user_id: user.id }
                });
                setIsFollowing(false);
            } else {
                await axios.post(`http://localhost:8000/api/followers/${mentor.id}`, {
                    user_id: user.id
                });
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Błąd przy zmianie obserwowania:", error);
        }
    };

    const handleSubscribe = async () => {
        if (!user?.id || !mentor) return;

        try {
            const response = await axios.post('http://localhost:8000/api/subscriptions/create-checkout-session', {
                mentor_id: mentor.id,
                user_id: user.id,
                price_id: 'price_1RoomeBNgF2XAMvXtpxP0RyU',
                mentor_username: mentor.profile.username
            });
            const { sessionId } = response.data.data;

            const stripe = await stripePromise;
            const { error } = await stripe!.redirectToCheckout({
                sessionId: sessionId
            });
            if (error) {
                console.error('Stripe error:', error);
            }
        } catch (error) {
            console.error('Błąd przy tworzeniu sesji płatności:', error);
        }
    };

    const openArticleModal = (post: any) => {
        setSelectedPost(post);
        setArticleModalOpen(true);
    };

    const closeArticleModal = () => {
        setArticleModalOpen(false);
        setSelectedPost(null);
    };

    return (
        <ProtectedRoute>
            <Navigation
                activeSection=""
                user = {user!}
                handleLogout={logout}
                accountDropdownOpen = {accountDropdownOpen}
                setAccountDropdownOpen={setAccountDropdownOpen}
                notifyDropdownOpen = {notifyDropdownOpen}
                setNotifyDropdownOpen={setNotifyDropdownOpen}
                type="standard"
            />

            {mentor ? (
                <>
                    <main className="w-full pb-[100px]">
                        <MentorFinderProperties mentor={mentor!} articles={mentor.articles} followers={mentor.followers} />
                        <MentorFinderActions isFollowing={isFollowing} onFollowToggle={handleFollowToggle} onSubscribe={handleSubscribe} />
                        <MentorFinderArticles mentor={mentor!} articles={mentor.articles} openArticleModal = {openArticleModal} />
                    </main>

                    { (isArticleModalOpen && selectedPost) && (
                        <MentorArticleModal closeArticleModal = {closeArticleModal} selectedPost = {selectedPost} />
                    )}
                </>
            ) : (
                <div>Podany użytkownik nie istnieje</div>
            )
            }
        </ProtectedRoute>
    );
}

export default function MentorSearchPage() {
    return (
        <Suspense fallback={<SearchLoading />}>
            <MentorSearchContent />
        </Suspense>
    );
}