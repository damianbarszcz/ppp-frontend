import React, {useEffect, useState} from "react";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";
import Button from "@/app/components/ui/Button";
import {Contact} from "@/app/types";
import {getInitials} from "@/app/components/utils/avatar";
import {isDarkColor} from "@/app/components/utils/color";

const AddTeamModal: React.FC<{
    setTeamModalOpen: (open: boolean) => void;
    handleCreateTeam: (e: React.FormEvent) => void;
    title: string;
    setTitle: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    getFieldError: (fieldName: string) => string;
    selectedContacts: number[];
    setSelectedContacts: (contacts: number[]) => void;
    userContacts: Contact[];

}> = ({
          title,
          setTitle,
          description,
          setDescription,
          selectedContacts,
          setSelectedContacts,
          userContacts,
          setTeamModalOpen,
          handleCreateTeam,
          getFieldError,
      }) => {
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const filtered = userContacts.filter(contact => {
            const profile = contact.contact_user?.profile;
            if (!profile) return false;
            const { username, name, surname } = profile;
            const searchLower = searchTerm.toLowerCase();

            return (
                username.toLowerCase().includes(searchLower) ||
                name.toLowerCase().includes(searchLower) ||
                surname.toLowerCase().includes(searchLower) ||
                `${name} ${surname}`.toLowerCase().includes(searchLower)
            );
        });
        setFilteredContacts(filtered);
    }, [userContacts]);

    const handleContactToggle = (contactId: number) => {
        if (selectedContacts.includes(contactId)) {
            setSelectedContacts(selectedContacts.filter(id => id !== contactId));
        } else {
            setSelectedContacts([...selectedContacts, contactId]);
        }
    };

    const isContactSelected = (contactId: number) => {
        return selectedContacts.includes(contactId);
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center h-full w-full bg-black bg-opacity-60 overflow-y-auto">
            <div className="w-[1025px] min-h-[500px] mx-auto p-12 shadow-lg rounded-md bg-white">
                <form onSubmit={handleCreateTeam}>
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <div className="flex justify-between">
                                <header>
                                    <h2 className="font-semibold text-xl text-app-dark">Stwórz zespół</h2>
                                    <p className="mt-5 font-regular text-base text-app-silver">
                                        Stwórz zespół podając jego podstawowe informacje. Dodatkowo masz możliwość
                                        zaproszenia do zespołu swoich partnerów z listy kontaktowej.
                                    </p>
                                </header>
                            </div>

                            <div className="mt-10">
                                <div className="mb-10">
                                    <Input
                                        isLabel={true}
                                        labelCaption="Nazwa zespołu"
                                        name="title"
                                        type="text"
                                        placeholder="Podaj unikalna nazwe swojego zespołu."
                                        uiType="light"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        validateError={getFieldError('title')}
                                    />
                                </div>

                                <div className="mb-10">
                                    <Textarea
                                        isLabel={true}
                                        labelCaption="Opis"
                                        name="description"
                                        type="text"
                                        placeholder="Daj ludziom znać, czym zajmuje się ten zespół"
                                        uiType="light"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        validateError={getFieldError('description')}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between">
                            <div>
                                <div className="flex justify-end">
                                    <span className="cursor-pointer" onClick={() => setTeamModalOpen(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
                                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                                        </svg>
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-base font-medium global--text-dark mb-2">Członkowie zespołu</h3>
                                    <p className="text-sm global--text-silver mb-4">
                                        Wybierz kontakty, które chcesz dodać do zespołu
                                    </p>

                                    {filteredContacts.length > 0 ? (
                                        <div className="divide-y divide-gray-100">
                                            {filteredContacts.map((contact) => {
                                                const initials = getInitials(contact.contact_user?.profile.name, contact.contact_user?.profile.surname);
                                                const isDark = isDarkColor(contact.contact_user?.profile.user_avatar_color);
                                                const textColorClass = isDark ? 'text-white' : 'text-black';

                                                const profile = contact.contact_user?.profile;
                                                if (!profile) return null;

                                                return (
                                                    <label key={contact.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
                                                        <input type="checkbox" checked={isContactSelected(contact.contact_user_id)}
                                                            onChange={() => handleContactToggle(contact.contact_user_id)}
                                                            className="mr-3 h-4 w-4 app-text-blue rounded border-gray-300"
                                                        />

                                                        <div className="flex items-center flex-1">
                                                            <figure style={{ backgroundColor: contact.contact_user?.profile.user_avatar_color }} className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${textColorClass}`}>
                                                                <span className="text-sm font-medium ">
                                                                    {initials}
                                                                </span>
                                                            </figure>

                                                            <div>
                                                                <div className="font-medium text-app-dark">{contact.contact_user?.profile.name} {contact.contact_user?.profile.surname}</div>
                                                                <div className="text-sm text-app-silver">@{contact.contact_user?.profile.username}</div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center p-6 bg-gray-50 rounded-md">
                                            <p className="text-app-silver">Brak kontaktów spełniających kryteria wyszukiwania.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-right">
                                <Button type="submit" uiType="primary" size="regularSize">Stwórz zespół</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTeamModal;