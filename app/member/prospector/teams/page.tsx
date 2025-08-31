"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import axios from "axios";
import {API_CONFIG} from "@/app/config/global";
import {Contact, ValidationError} from "@/app/types";
import TeamManager from "@/app/member/prospector/teams/TeamManager";
import YourTeamList from "@/app/member/prospector/teams/YourTeamList";
import Message from "@/app/components/ui/Message";
import TeamInvitationsList from "@/app/member/prospector/teams/TeamInvitationList";
import {AddTeamModal} from "@/app/components/modals";

// Dodaj typ dla TeamInvitation
interface TeamInvitation {
    id: number;
    team_id: number;
    invited_user_id: number;
    inviter_user_id: number;
    status: 'pending' | 'accepted' | 'rejected';
    team: {
        id: number;
        title: string;
        slug: string;
        team_details: {
            description: string;
            tags: string[];
            team_avatar_color: string;
        }
    };
    inviter?: {
        id: number;
        profile: {
            name: string;
            surname: string;
            username: string;
        }
    };
    created_at: string;
}

// Dodaj typ dla powiadomienia o zespole
interface TeamNotification {
    id: number;
    message: string;
    sender: {
        id: number;
        email: string;
        profile: {
            name: string;
            surname: string;
            username: string;
            user_avatar_color: string;
        }
    };
    created_at: string;
}

export default function TeamsPage() {
    const {user, logout} = useAuth();
    const [accountDropdownOpen,setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('all');
    const [teamModalOpen, setTeamModalOpen] = useState(false);
    const [yourTeams, setYourTeams] = useState([]);
    const [teamInvitations, setTeamInvitations] = useState<{
        sentInvitations: TeamInvitation[],
        receivedInvitations: TeamInvitation[]
    }>({ sentInvitations: [], receivedInvitations: [] });
    const [msgSuccess, setMsgSuccess] = useState('');
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
    const [userContacts, setUserContacts] = useState<Contact[]>([]);
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

    useEffect(() : void => {
        const msgSuccessBox = sessionStorage.getItem('teamCreateSuccessMessage');
        if (msgSuccessBox) {
            setMsgSuccess(msgSuccessBox);
            sessionStorage.removeItem('teamCreateSuccessMessage');
        }
    }, []);

    useEffect(() => {
        const fetchTeams = async () : Promise<void> => {
            if (!user?.id) return;
            try {
                const response = await axios.get(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.team.fetchTeams + user.id}`);
                if (response.data.success) {
                    setYourTeams(response.data.data);
                }
            } catch (error) {
                console.error("Błąd przy pobieraniu zespołów", error);
            }
        };

        fetchTeams();
    }, [user]);

    useEffect(() => {
        const fetchTeamInvitations = async () : Promise<void> => {
            if (!user?.id) return;
            try {
                const response = await axios.get(`${API_CONFIG.baseUrl}/api/team/invitations/${user.id}`);
                if (response.data.success) {
                    setTeamInvitations(response.data.data);
                }
            } catch (error) {
                console.error("Błąd przy pobieraniu zaproszeń zespołowych", error);
            }
        };

        fetchTeamInvitations();
    }, [user]);

    useEffect(() => {
        const fetchUserContacts = async () : Promise<void> => {
            if (!user?.id) return;
            try {
                const response = await axios.get(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.contact.fetchYourContacts + user.id}`);
                if (response.data.success) {
                    setUserContacts(response.data.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserContacts();
    }, [user]);

    const handleCreateTeam = async (e: React.FormEvent) : Promise<void> => {
        e.preventDefault();
        if (!user?.id) return;
        try {
            const response = await axios.post(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.team.handleCreateTeam}`, {
                    title,
                    description,
                    user_id: user.id,
                    members: selectedContacts
                }
            );
            if (response.data.success) {
                sessionStorage.setItem('teamCreateSuccessMessage', response.data.message);
                window.location.reload();
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setValidationErrors([{
                    field: 'general',
                    message: error.response.data.message
                }]);
            }
        }
    }

    const handleAcceptTeamInvitation = async (teamId: number) => {
        if (!user?.id) return;

        const invitation = teamInvitations.receivedInvitations.find(inv => inv.team.id === teamId);
        if (!invitation) return;

        try {
            const response = await axios.post(`${API_CONFIG.baseUrl}/api/team/invitations/${invitation.id}/accept`, {
                user_id: user.id
            });
            if (response.data.success) {
                // Odśwież listę zaproszeń
                const updatedInvitations = await axios.get(`${API_CONFIG.baseUrl}/api/team/invitations/${user.id}`);
                if (updatedInvitations.data.success) {
                    setTeamInvitations(updatedInvitations.data.data);
                }
            }
        } catch (error) {
            console.error('Błąd podczas akceptacji zaproszenia:', error);
        }
    };

    const handleRejectTeamInvitation = async (teamId: number) => {
        if (!user?.id) return;

        const invitation = teamInvitations.receivedInvitations.find(inv => inv.team.id === teamId);
        if (!invitation) return;

        try {
            const response = await axios.delete(`${API_CONFIG.baseUrl}/api/team/invitations/${invitation.id}/reject`, {
                data: { user_id: user.id }
            });
            if (response.data.success) {
                // Odśwież listę zaproszeń
                const updatedInvitations = await axios.get(`${API_CONFIG.baseUrl}/api/team/invitations/${user.id}`);
                if (updatedInvitations.data.success) {
                    setTeamInvitations(updatedInvitations.data.data);
                }
            }
        } catch (error) {
            console.error('Błąd podczas odrzucania zaproszenia:', error);
        }
    };

    const getFieldError = (fieldName: string): string => {
        const error = validationErrors.find(err => err.field === fieldName);
        return error ? error.message : '';
    };

    return (
        <ProtectedRoute>
            { msgSuccess && ( <Message message ={msgSuccess} type="success" /> )}

            <Navigation
                activeSection="teams"
                user = {user!}
                handleLogout={logout}
                accountDropdownOpen = {accountDropdownOpen}
                setAccountDropdownOpen={setAccountDropdownOpen}
                notifyDropdownOpen = {notifyDropdownOpen}
                setNotifyDropdownOpen={setNotifyDropdownOpen}
                type="standard"
            />

            <TeamManager
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                teams={yourTeams}
                receivedInvitations={teamInvitations.receivedInvitations.map(inv => inv.team)}
                setTeamModalOpen={setTeamModalOpen}
            />

            { (activeSection == 'all') && <YourTeamList teams={yourTeams} setTeamModalOpen = {setTeamModalOpen} /> }
            { (activeSection == 'invitations') &&
                <TeamInvitationsList
                    invitations={teamInvitations.sentInvitations.map(inv => inv.team)}
                    receivedInvitations={teamInvitations.receivedInvitations.map(inv => inv.team)}
                    handleAcceptInvitation={handleAcceptTeamInvitation}
                    handleRejectInvitation={handleRejectTeamInvitation}
                />
            }

            { teamModalOpen &&
                <AddTeamModal
                    setTeamModalOpen={setTeamModalOpen}
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    selectedContacts={selectedContacts}
                    setSelectedContacts={setSelectedContacts}
                    userContacts={userContacts}
                    handleCreateTeam={handleCreateTeam}
                    getFieldError={getFieldError}
                /> }
        </ProtectedRoute>
    );
}