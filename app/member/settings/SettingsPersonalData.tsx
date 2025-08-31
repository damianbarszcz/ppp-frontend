import React from "react";
import { MoreHorizontal } from "lucide-react";
import { PersonalDataModal } from "@/app/components/modals/settings";
import {PersonalData} from "@/app/types";

const SettingsPersonalData: React.FC<PersonalData> = ({
     user,
     savePersonalData,
     modalType,
     isModalOpen,
     openModal,
     closeModal
} : PersonalData ) => {

    return (
        <section className="w-full mt-10 col-span-9">
            <header>
                <h2 className="text-xl font-semibold mb-2 font-body global--text-black">Dane osobowe</h2>
                <p className="text-base mb-5 font-body global--text-silver">Twoje dane osobowe z możliwością ich edycji.</p>
            </header>

            <div className="global--border-d-white rounded-md">
                <div className="pt-5 pb-5 pl-5 pr-5 grid grid-cols-3 border-b global--b-border-d-white items-center">
                    <div className="relative">
                        <span className="font-body global--text-dark text-sm font-medium">Imię i nazwisko</span>
                    </div>
                    <div className="relative">
                        <span className="font-body global--text-silver text-sm">
                            {user.profile.name} {user.profile.surname}
                        </span>
                    </div>
                    <div className="relative text-right">
                        <button type="button" className="p-2 border rounded hover:bg-gray-50" onClick={() => openModal('name')}>
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>

                <div className="pt-5 pb-5 pl-5 pr-5 grid grid-cols-3 border-b global--b-border-d-white items-center">
                    <div className="relative">
                        <span className="font-body global--text-dark text-sm font-medium">Nazwa użytkownika</span>
                    </div>
                    <div className="relative">
                        <span className="font-body global--text-silver text-sm">
                            {user.profile.username }
                        </span>
                    </div>
                    <div className="relative text-right">
                        <button type="button" className="p-2 border rounded hover:bg-gray-50" onClick={() => openModal('username')}>
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>

                <div className="pt-5 pb-5 pl-5 pr-5 grid grid-cols-3 border-b global--b-border-d-white items-center">
                    <div className="relative">
                        <span className="font-body global--text-dark text-sm font-medium">Biogram</span>
                    </div>

                    <div className="relative">
                        <span className="font-body global--text-silver text-sm">
                            {user.profile.biogram ? (user.profile.biogram.length > 100 ?
                                user.profile.biogram.substring(0, 150) + '...' :
                                user.profile.biogram) : ''}
                        </span>
                    </div>

                    <div className="relative text-right">
                        <button type="button" className="p-2 border rounded hover:bg-gray-50" onClick={() => openModal('biogram')}>
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>

                <div className="pt-5 pb-5 pl-5 pr-5 grid grid-cols-3 border-b global--b-border-d-white items-center">
                    <div className="relative">
                        <span className="font-body global--text-dark text-sm font-medium">Hasło</span>
                    </div>

                    <div className="relative">
                        <span className="font-body global--text-silver text-sm">{"•".repeat(user.password_length)} </span>
                    </div>

                    <div className="relative text-right">
                        <button type="button" className="p-2 border rounded hover:bg-gray-50" onClick={() => openModal('password')}>
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>

                <div className="pt-5 pb-5 pl-5 pr-5 grid grid-cols-3 border-b global--b-border-d-white items-center">
                    <div className="relative">
                        <span className="font-body global--text-dark text-sm font-medium">Adres email</span>
                    </div>

                    <div className="relative">
                        <span className="font-body global--text-silver text-sm">{user.email}</span>
                    </div>
                </div>


                <div className="pt-5 pb-5 pl-5 pr-5 grid grid-cols-3 items-center">
                    <div className="relative">
                        <span className="font-body global--text-dark text-sm font-medium">Rola konta</span>
                    </div>

                    <div className="relative">
                        <span className="font-body global--text-silver text-sm">
                            {user.account_type == 'M' ? "Mentor" : "Poszukiwacz"}
                        </span>
                    </div>
                </div>
            </div>

            {modalType && (
                <PersonalDataModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSave={savePersonalData}
                    modalType={modalType}
                    currentUser={{
                        name: user.profile.name,
                        surname: user.profile.surname,
                        username: user.profile.username,
                        biogram: user.profile.biogram
                    }}
                />
            )}
        </section>
    );
};

export default SettingsPersonalData;