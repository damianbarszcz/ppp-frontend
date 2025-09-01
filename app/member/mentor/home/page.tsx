"use client";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {API_CONFIG} from "@/app/config/global";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import Message from "@/app/components/ui/Message";
import MentorFinderProperties from "@/app/components/mentor-finder/MentorFinderProperties";
import MentorFinderArticles from "@/app/components/mentor-finder/MentorFinderArticles";
import {MentorArticleModal} from "@/app/components/modals";

export default function HomePage() {
    const {user, logout} = useAuth();
    const [accountDropdownOpen,setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
    const [articles, setArticles] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [msgSuccess, setMsgSuccess] = useState('');
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isArticleModalOpen, setArticleModalOpen] = useState(false);

    useEffect(() : void => {
        const msgSuccessBox = sessionStorage.getItem('articleSuccessMessage');
        if (msgSuccessBox) {
            setMsgSuccess(msgSuccessBox);
            sessionStorage.removeItem('articleSuccessMessage');
        }
    }, []);

    useEffect(() : void => {
        const fetchArticles = async () : Promise<void> => {
            if (!user?.id) return;
            try {
                const response = await axios.get(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.article.getArticles + user.id}`);
                if (response.data.success) {
                    setArticles(response.data.data);
                }
            } catch (error) {
                console.error("Błąd przy pobieraniu postów", error);
            }
        };
        const fetchFollowers  = async () : Promise<void> => {
            if (!user?.id) return;
            try {
                const response = await axios.get(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.follower.getFollowers + user.id}`);
                if (response.data.success) {
                    setFollowers(response.data.data);
                }
            } catch (error) {
                console.error("Błąd przy pobieraniu obserwująch mentora", error);
            }
        }
        fetchFollowers();
        fetchArticles();
    }, [user]);

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
            { msgSuccess && ( <Message message ={msgSuccess} type="success" /> )}

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

            <main className="w-full pb-[100px]">
                <MentorFinderProperties mentor={user!} articles={articles} followers={followers} />
                <MentorFinderArticles mentor={user!} articles={articles} openArticleModal = {openArticleModal} />
            </main>

            { (isArticleModalOpen && selectedPost) && (
                <MentorArticleModal closeArticleModal = {closeArticleModal} selectedPost = {selectedPost} />
            )}
        </ProtectedRoute>
    );
}
