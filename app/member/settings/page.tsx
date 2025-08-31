"use client";
import React, {useEffect, useState} from "react";
import { useAuth } from "@/app/context/AuthContext";
import {API_CONFIG} from "@/app/config/global";
import axios from "axios";
import ProtectedRoute from '@/app/routes/protected/ProtectedRoute';
import Navigation from "@/app/components/navigation/Navigation";
import SettingsPersonalData from "@/app/member/settings/SettingsPersonalData";
import SettingsHeader from "@/app/member/settings/SettingsHeader";
import Sidenav from "@/app/components/sidenav/Sidenav";
import SettingsPayments from "@/app/member/settings/SettingsPayments";
import Message from "@/app/components/ui/Message";

export default function SettingsPage() {
    const {user, logout} = useAuth();
    const [accountDropdownOpen,setAccountDropdownOpen] = useState(false);
    const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('personal-data');
    const [modalType, setModalType] = useState<'name' | 'username' | 'biogram'  | 'password' | null>(null);
    const [msgSuccess, setMsgSuccess] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userData, setUserData] = useState({});

    useEffect(() : void => {
        const msgSuccessBox = sessionStorage.getItem('editDataSuccessMessage');
        if (msgSuccessBox) {
            setMsgSuccess(msgSuccessBox);
            sessionStorage.removeItem('editDataSuccessMessage');
        }
    }, []);

    const savePersonalData = async (data: any) => {
        let httpSetter: string = '';
        let requestData: any = { user_id: user?.id };

        switch (modalType) {
            case 'name':
                setUserData(prev => ({...prev, name: data.name, surname: data.surname}));

                httpSetter = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.settings.changeName}`;
                requestData = {
                    user_id: user?.id,
                    name: data.name,
                    surname: data.surname
                };
                break;
            case 'username':
                setUserData(prev => ({...prev, username: data.username }));
                httpSetter = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.settings.changeUsername}`;
                requestData = {
                    user_id: user?.id,
                    username: data.username
                };
                break;
            case 'biogram':
                setUserData(prev => ({...prev, biogram: data.biogram}));

                httpSetter = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.settings.changeBiogram}`;
                requestData = {
                    user_id: user?.id,
                    biogram: data.biogram
                };
                break;
            case 'password':
                httpSetter = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.settings.changePassword}`;
                requestData = {
                    user_id: user?.id,
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword
                };
                break;
        }

        try {
            const response = await axios.put(httpSetter, requestData);

            if (response.data.success) {
                sessionStorage.setItem('editDataSuccessMessage', response.data.message);
                window.location.reload();
            }
        } catch (error: any) {
            throw error;
        }
    };

    const openModal = (type: 'name' | 'username' | 'biogram' | 'password') => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalType(null);
    };

    return (
        <ProtectedRoute>
            { msgSuccess && ( <Message message ={msgSuccess} type="success" /> )}

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

            <main className="pb-10">
                <SettingsHeader />

                <div className="grid grid-cols-12 max-w-6xl m-auto gap-4">
                    <Sidenav activeSection={activeSection}  setActiveSection={setActiveSection} user={user!} />
                    { (activeSection == 'personal-data') && <SettingsPersonalData
                        user={user!}
                        savePersonalData={savePersonalData}
                        modalType={modalType}
                        isModalOpen={isModalOpen}
                        openModal={openModal}
                        closeModal={closeModal}
                    /> }
                    { (activeSection == 'payments') && <SettingsPayments user = {user!}  /> }
                </div>
            </main>
        </ProtectedRoute>
    );
}
