"use client";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {API_CONFIG} from "@/app/config/global";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import ContactManager from "@/app/member/prospector/contacts/ContactManager";
import YourContactsList from "@/app/member/prospector/contacts/YourContactsList";
import ContactsInvitationsList from "@/app/member/prospector/contacts/ContactInvitationsList";
import { AddContactModal } from "@/app/components/modals";
import {Contact,ValidationError} from "@/app/types";
import Message from "@/app/components/ui/Message";

export default function ContactsPage() {
    const { user, logout } = useAuth();
    const [accountDropdownOpen,setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
    const [msgSuccess, setMsgSuccess] = useState('');
    const [contactModalOpen, setContactModalOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('all');
    const [yourContacts, setYourContacts] = useState<Contact[]>([]);
    const [yourInvitations, setYourInvitations] = useState<Contact[]>([]);
    const [receivedInvitations, setReceivedInvitations] = useState<Contact[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
    const [username, setUsername] = useState("");
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
    const [filteredInvitations, setFilteredInvitations] = useState<Contact[]>([]);

    useEffect(() : void => {
        const msgSuccessBox = sessionStorage.getItem('contactInvitationSuccessMessage');
        if (msgSuccessBox) {
            setMsgSuccess(msgSuccessBox);
            sessionStorage.removeItem('contactInvitationSuccessMessage');
        }
    }, []);

    useEffect(() => {
        const fetchYourContacts = async () : Promise<void> => {
            if (!user?.id) return;
            try {
                const response = await axios.get(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.contact.fetchYourContacts + user.id}`);
                if (response.data.success) {
                    setYourContacts(response.data.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchYourContacts();
    }, [user]);

    useEffect(() => {
        const fetchYourInvitations = async () : Promise<void> => {
            if (!user?.id) return;
            try {
                const response = await axios.get(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.contact.fetchYourInvitations + user.id}`);
                if (response.data.success) {
                    setYourInvitations(response.data.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchYourInvitations();
    }, [user]);

    useEffect(() => {
        const fetchYourInvitations = async () : Promise<void> => {
            if (!user?.id) return;
            try {
                const response = await axios.get(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.contact.fetchYourInvitations + user.id}`);
                if (response.data.success) {
                    setYourInvitations(response.data.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchYourInvitations();
    }, [user]);

    useEffect(() => {
        const fetchReceivedInvitations = async () : Promise<void> => {
            if (!user?.id) return;
            try {
                const response = await axios.get(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.contact.getReceivedInvitations + user.id}`);
                if (response.data.success) {
                    setReceivedInvitations(response.data.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchReceivedInvitations();
    }, [user]);

    const handleAddContact = async (e: React.FormEvent) : Promise<void> => {
        e.preventDefault();
        setValidationErrors([]);
        if (!user?.id) return;
        try {
            const response = await axios.post(`
            ${API_CONFIG.baseUrl}${API_CONFIG.endpoints.contact.sendContactInvitation + user.id}`, {
                    username,
                    user_id: user.id,
                }
            );
            if (response.data.success) {
                sessionStorage.setItem('contactInvitationSuccessMessage', response.data.message);
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

    const handleAcceptInvitation = async (contactId: number) => {
        if (!user?.id) return;
        try {
            const response = await axios.put(
                `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.contact.acceptContactInvitation + user.id  + '/' + contactId}`
            );

            if (response.data.success) {
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRejectInvitation = async (contactId: number) => {
        if (!user?.id) return;
        try {
            const response = await axios.delete(
                `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.contact.rejectContactInvitation + user.id  + '/' + contactId}`
            );

            if (response.data.success) {
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (filtered: Contact[]) : void => {
        if (activeSection === 'all') {
            setFilteredContacts(filtered);
        } else if (activeSection === 'invitations') {
            setFilteredInvitations(filtered);
        }
    };

    const getFieldError = (fieldName: string): string => {
        const error = validationErrors.find(err => err.field === fieldName);
        return error ? error.message : '';
    };

    const displayedContacts = filteredContacts.length > 0 ? filteredContacts : yourContacts;
    const displayedInvitations = filteredInvitations.length > 0 ? filteredInvitations : receivedInvitations;

    return (
        <ProtectedRoute>
            { msgSuccess && ( <Message message ={msgSuccess} type="success" /> )}

            <Navigation
                activeSection="contacts"
                user={user!}
                handleLogout={logout}
                accountDropdownOpen = {accountDropdownOpen}
                setAccountDropdownOpen={setAccountDropdownOpen}
                notifyDropdownOpen = {notifyDropdownOpen}
                setNotifyDropdownOpen={setNotifyDropdownOpen}
                type="standard"
            />

            <ContactManager
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                contacts={yourContacts}
                receivedInvitations={receivedInvitations}
                setContactModalOpen={setContactModalOpen}
                onSearch={handleSearch}
            />

            { (activeSection == 'all') && <YourContactsList contacts={displayedContacts} /> }
            { (activeSection == 'invitations') &&
                <ContactsInvitationsList
                    invitations={yourInvitations}
                    receivedInvitations={displayedInvitations}
                    handleAcceptInvitation={handleAcceptInvitation}
                    handleRejectInvitation={handleRejectInvitation}
                />
            }

            { contactModalOpen &&
                <AddContactModal
                    setContactModalOpen={setContactModalOpen}
                    username = {username}
                    setUsername={setUsername}
                    handleAddContact={handleAddContact}
                    getFieldError={getFieldError}
                /> }
        </ProtectedRoute>
    );
}