"use client";
import React, {useEffect, useState, Suspense} from "react";
import axios from "axios";
import {API_CONFIG} from "@/app/config/global";
import { useAuth } from "@/app/context/AuthContext";
import {loadStripe} from "@stripe/stripe-js";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import MentorFinderProperties from "@/app/components/mentor-finder/MentorFinderProperties";
import MentorFinderArticles from "@/app/components/mentor-finder/MentorFinderArticles";
import MentorFinderActions from "@/app/components/mentor-finder/MentorFinderActions";
import MentorArticleModal from "@/app/components/modals/home/MentorArticleModal";
import SubscriptionMentorModal from "@/app/components/modals/mentor-finder/SubscriptionMentorModal";
import Loader from "@/app/components/ui/Loader";
import {Mentor} from "@/app/types";
import {useSearchParams} from "next/navigation";

function MentorSearchContent() {
    const {user, logout} = useAuth();
    const [mentor, setMentor] = useState<Mentor>();
    const [accountDropdownOpen,setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [userHasSubscription, setUserHasSubscription] = useState(false);
    const [isArticleModalOpen, setArticleModalOpen] = useState(false);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const searchParams = useSearchParams();
    const username = searchParams.get("username");
    const [isFollowing, setIsFollowing] = useState(false);
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

    useEffect(() => {
        const fetchMentor = async () => {
            if (!username) return;
            try {
                const response = await axios.get(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.user.fetchMentor + username}`);
                if (response.data.success) {
                    setMentor(response.data.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchMentor();
    }, [username]);

    useEffect(() => {
        const checkFollowingStatus = async () => {
            if (!user?.id || !mentor?.id || user.id === mentor.id) {
                setIsFollowing(false);
                return;
            }
            try {
                const response = await axios.get(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.follower.checkIsFollowing  + user.id + '/' + mentor.id}`);
                setIsFollowing(response.data.data.isFollowing);
            } catch (error) {
                setIsFollowing(false);
            }
        };

        checkFollowingStatus();
    }, [user?.id, mentor?.id]);

    useEffect(() => {
        const checkSubscribeStatus = async () => {
            if (!user?.id || !mentor?.id || user.id === mentor.id) {
                setUserHasSubscription(false);
                return;
            }
            try {
                const response = await axios.get(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.payments.checkIsSubscribe  + user.id + '/' + mentor.id}`);
                setUserHasSubscription(response.data.data.hasActiveSubscription);
            } catch (error) {
                setUserHasSubscription(false);
            }
        };

        checkSubscribeStatus();
    }, [user?.id, mentor?.id]);

    const handleFollowToggle = async () => {
        if (!user?.id || !mentor || user.id === mentor.id) return;

        try {
            if (isFollowing) {
                await axios.delete(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.follower.unfollowMentor}${mentor.id}`, {
                        data: { user_id: user.id }
                    });
                setIsFollowing(false);
                setMentor((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        followers: prev.followers.filter(f => f.user_id !== user.id)
                    };
                });
            } else {
                await axios.post(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.follower.followMentor}${mentor.id}`, {
                        user_id: user.id
                    });
                setIsFollowing(true);
                setMentor((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        followers: [...prev.followers, {
                            id: Date.now(),
                            mentor_id: mentor.id,
                            user_id: user.id,
                            followedUser: mentor,
                            follower: user,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }]
                    };
                });
            }
        } catch (error) {
            console.error("Błąd przy zmianie obserwowania:", error);
        }
    };

    const handleSubscribe = async () => {
        if (!user?.id || !mentor) return;

        try {
            const response = await axios.post(
                `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.managePlan.createUserMentorSubscribeSession}`
                , {
                mentor_id: mentor.id,
                user_id: user.id,
                price_value: mentor.profile.mentor_subscribe_price,
                mentor_username: mentor.profile.username
            });
            const { sessionId } = response.data.data;

            const stripe = await stripePromise;
            const { error } = await stripe!.redirectToCheckout({
                sessionId: sessionId
            });
            if (error) {
                console.error(error);
            }
        } catch (error) {
            console.error('Błąd przy tworzeniu sesji płatności:', error);
        }
    };

    const openArticleModal = (post: any) => {
        if (post.content_type === 'paid' && !userHasSubscription) {
            setIsSubscriptionModalOpen(true);
            return;
        }
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

            {mentor && (
                <>
                    <main className="w-full pb-[100px]">
                        <MentorFinderProperties mentor={mentor!} articles={mentor.articles} followers={mentor.followers} />
                        <MentorFinderActions
                            isFollowing={isFollowing}
                            userHasSubscription={userHasSubscription}
                            onFollowToggle={handleFollowToggle}
                            handleSubscribe={handleSubscribe}
                        />
                        <MentorFinderArticles mentor={mentor!} articles={mentor.articles} openArticleModal = {openArticleModal} />
                    </main>

                    { (isArticleModalOpen && selectedPost) && (
                        <MentorArticleModal
                            closeArticleModal = {closeArticleModal}
                            selectedPost = {selectedPost}
                        />
                    )}
                    { isSubscriptionModalOpen && (
                        <SubscriptionMentorModal
                            mentor={mentor!}
                            handleSubscribe={handleSubscribe}
                            closeSubscriptionModal={(value) => setIsSubscriptionModalOpen(value)}  />
                    )}
                </> )
            }
        </ProtectedRoute>
    );
}

export default function MentorSearchPage() {
    return (
        <Suspense fallback={<Loader />}>
            <MentorSearchContent />
        </Suspense>
    );
}