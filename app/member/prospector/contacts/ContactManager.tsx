import React, {useState} from "react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import {Contact} from "@/app/types";

interface ContactManagerProps {
    contacts: Contact[];
    receivedInvitations: Contact[];
    onSearch: (filtered: any[]) => void;
    activeSection: string;
    setActiveSection: (section: string) => void;
    setContactModalOpen: (open: boolean) => void;
}

const ContactManager: React.FC<ContactManagerProps> = ({
    contacts,
    receivedInvitations,
    onSearch,
    activeSection,
    setActiveSection,
    setContactModalOpen
} : ContactManagerProps) => {
    const [searchContact, setSearchContact] = useState("");

    const handleSearchContact = (e: React.ChangeEvent<HTMLInputElement>) : void => {
        const value = e.target.value.toLowerCase();
        setSearchContact(value);

        if (activeSection === 'all') {
            const filtered = contacts.filter(contactData => {
                const profile = contactData.contact_user?.profile;
                if (!profile) return false;

                const { username, name, surname } = profile;

                return (
                    username.toLowerCase().includes(value) ||
                    name.toLowerCase().includes(value) ||
                    surname.toLowerCase().includes(value) ||
                    `${name} ${surname}`.toLowerCase().includes(value)
                );
            });
            onSearch(filtered);
        } else if (activeSection === 'invitations') {
            const filtered = receivedInvitations.filter(invitation => {
                const profile = invitation.creator?.profile;
                if (!profile) return false;

                const { username, name, surname } = profile;

                return (
                    username.toLowerCase().includes(value) ||
                    name.toLowerCase().includes(value) ||
                    surname.toLowerCase().includes(value) ||
                    `${name} ${surname}`.toLowerCase().includes(value)
                );
            });
            onSearch(filtered);
        }
    };


    const handleSectionChange = (section: string) => {
        setActiveSection(section);
        setSearchContact("");
        onSearch([]);
    };

    return (
        <section className="w-full">
            <div className="m-auto max-w-6xl">
                <header className="pt-10 w-full">
                    <h1 className="text-3xl font-bold leading-[100px] global--text-dark">Twoje kontakty</h1>

                    <p className="text-lg font-regular global--text-silver">
                        Zarządzaj swoją listą kontaktów i dodawaj nowych.
                    </p>
                </header>

                <div className="flex justify-between items-center pt-20 w-full">
                    <div className="relative w-[400px]">
                        <Input
                            isLabel={false}
                            labelCaption=""
                            name="contact-search"
                            type="search"
                            placeholder="Wyszukaj"
                            uiType="light"
                            value={searchContact}
                            validateError=""
                            onChange={handleSearchContact}
                        />

                        <div className="absolute top-3 right-3">
                            <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#5F6368">
                                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14
                                    83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex items-end">
                    <div className="mt-8 w-full">
                        <ul className="flex relative space-x-3 list-none">
                            <li className="relative pr-3">
                                <button type="button" className={`${activeSection == 'all' ? 'text-app-blue' : 'text-app-silver'}  text-base font-medium`}
                                    onClick={() => handleSectionChange('all')}>
                                    Twoje kontakty ({contacts.length})
                                </button>
                            </li>

                            <li className="relative pr-3 pl-3">
                                <button type="button" className={`${activeSection == 'invitations' ? 'text-app-blue' : 'text-app-silver'}  text-base font-medium`}
                                    onClick={() => handleSectionChange('invitations')}>
                                    Zaproszenia ({receivedInvitations.length})
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <Button type="button" uiType="primary" size="regularSize" onClick={() => setContactModalOpen(true)}>
                            Dodaj kontakt
                        </Button>
                    </div>
                </div>

                <div className="mt-4 w-full h-px bg-app-dark-white"></div>
            </div>
        </section>
    );
};

export default ContactManager;