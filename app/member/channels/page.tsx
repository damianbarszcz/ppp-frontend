"use client";
import React, {useState,useEffect} from "react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import ChannelList from "@/app/member/channels/ChannelList";
import ChannelActions from "@/app/member/channels/ChannelActions";
import ChannelCreator from "@/app/member/channels/ChannelCreator";
import axios from "axios";

export default function ChannelsPage() {
    const {user, logout} = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            if (!user?.id) return;
            try {
                const response = await axios.get(`http://localhost:8000/api/team/user/${user.id}`);
                if (response.data.success) {
                    setTeams(response.data.data);
                    console.log(response.data.data);
                }
            } catch (error) {
                console.error("Błąd przy pobieraniu zespołów", error);
            }
        };

        fetchTeams();
    }, [user]);

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;
        try {
            const response = await axios.post("http://localhost:8000/api/team/create",
                {
                    title,
                    description,
                    tags,
                    user_id: user.id,
                }
            );
            if (response.data.success) {
                setTitle('');
                setDescription('');
                window.location.href = "/member/channels";
            }
        } catch (error: any) {
            setTitle('');
            setDescription('');
        }
    }




    return (
        <ProtectedRoute>
            {user?.account_type === "P" && (
                <>
                    <Navigation
                        activeSection="channels"
                        user = {user!}
                        handleLogout={logout}
                        dropdownOpen = {dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                        type="standard"
                    />
                    <main>
                        <ChannelActions setModalOpen = {setModalOpen} />
                        <ChannelList teams={teams} />
                        {  isModalOpen && (
                            <ChannelCreator
                                handleCreateTeam= {handleCreateTeam}
                                title = {title}
                                setTitle = {setTitle}
                                description = {description}
                                setDescription = {setDescription}
                                tags = {tags}
                                setTags = {setTags}
                                setModalOpen = {setModalOpen}
                            />)
                        }
                    </main>
                </>
            )}
        </ProtectedRoute>
    );
}