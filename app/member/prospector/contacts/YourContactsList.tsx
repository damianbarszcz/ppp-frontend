import React from "react";
import {Contact} from "@/app/types";
import {getInitials} from "@/app/components/utils/avatar";
import {isDarkColor} from "@/app/components/utils/color";

interface YourContactListProps {
    contacts: Contact[];
}

const YourContactsList: React.FC<YourContactListProps> = ({contacts} : YourContactListProps) => {

    return (
        <section>
            {contacts.length > 0 ? (
                <div className="max-w-6xl mx-auto mt-12">
                    <div className="grid grid-cols-4 gap-4">
                        {contacts.map((contact : Contact) => {
                            const initials = getInitials(contact.contact_user?.profile.name, contact.contact_user?.profile.surname);
                            const isDark = isDarkColor(contact.contact_user?.profile.user_avatar_color);
                            const textColorClass = isDark ? 'text-white' : 'text-black';

                            return(
                            <div key={contact.id} className="relative bg-app-white min-h-128 rounded-md border border-app-dark-white">
                                <div className="pt-5 pb-5 pl-10 pr-10">
                                    <div>
                                        <figure className="relative m-auto h-24 w-24 rounded-full" style={{ backgroundColor: contact.contact_user?.profile.user_avatar_color }}>
                                            <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-2xl ${textColorClass}`}>
                                                {initials}
                                            </span>
                                        </figure>
                                    </div>

                                    <div className="mt-6 text-center">
                                        <span className="block text-lg mb-2 font-medium text-app-dark">{contact.contact_user?.profile.name} {contact.contact_user?.profile.surname}</span>
                                        <span className="block text-sm mb-2 font-regular text-app-silver">{contact.contact_user?.profile.username}</span>
                                        <span className="block text-sm mb-2 font-regular  text-app-silver">{contact.contact_user?.email}</span>
                                    </div>
                                </div>
                            </div>)
                            }
                        )}
                    </div>
                </div>
            ) : (
                <div className="p-32 max-w-6xl mx-auto">
                    <header className="text-center">
                        <h2 className="text-2xl text-app-dark font-semibold">Brak kontaktów</h2>
                        <p className="mt-5 text-base text-app-silver font-medium">Nie masz aktualnie nikogo wśród swoich kontaktów.</p>
                    </header>
                </div>
            )}
        </section>
    );
};

export default YourContactsList;