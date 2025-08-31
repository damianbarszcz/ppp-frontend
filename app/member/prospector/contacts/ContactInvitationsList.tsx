import React from "react";
import {Contact} from "@/app/types";
import {getInitials} from "@/app/components/utils/avatar";
import {isDarkColor} from "@/app/components/utils/color";
import Button from "@/app/components/ui/Button";

interface ContactListProps {
    invitations: Contact[];
    receivedInvitations: Contact[];
    handleAcceptInvitation: (contactId: number) => void;
    handleRejectInvitation: (contactId: number) => void;
}

const ContactsInvitationsList: React.FC<ContactListProps> = ({
  invitations,
  receivedInvitations,
  handleAcceptInvitation,
  handleRejectInvitation
}: ContactListProps) => {
    const hasAnyInvitations = invitations.length > 0 || receivedInvitations.length > 0;
    if (!hasAnyInvitations) {
        return (
            <section>
                <div className="p-32 max-w-6xl mx-auto">
                    <header className="text-center">
                        <h2 className="text-2xl text-app-dark font-semibold">Brak zaproszeń</h2>
                        <p className="mt-5 text-base text-app-silver font-medium">Nie masz aktualnie żadnych zaproszeń.</p>
                    </header>
                </div>
            </section>
        );
    }

    return (
        <section>
            {invitations.length > 0 && (
                <div className="max-w-6xl mx-auto mt-6">
                    <header className="mb-10">
                        <h2 className="font-medium">Zaproszenia wysłane przez Ciebie:</h2>
                    </header>

                    <div className="grid grid-cols-4 gap-4">
                        {invitations.map((contact : Contact) => {
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
                                            <span className="block text-sm mb-2 font-regular text-app-silver">@{contact.contact_user?.profile.username}</span>
                                            <span className="block text-sm mb-2 font-regular text-app-silver">{contact.contact_user?.email}</span>
                                        </div>

                                        <div className="mt-6 text-center">
                                            <span className="inline-block bg-app-light-yellow text-app-dark-yellow text-xs p-3 font-semibold rounded-3xl">
                                                Oczekuje na odpowiedź
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {receivedInvitations.length > 0 && (
                <div className="max-w-6xl mx-auto mt-10">
                    <header className="mb-10">
                        <h2 className="font-medium">Zaproszenia dla Ciebie:</h2>
                    </header>

                    <div className="grid grid-cols-4 gap-4">
                        {receivedInvitations.map((contact : Contact) => {
                            const initials = getInitials(contact.creator?.profile.name, contact.creator?.profile.surname);
                            const isDark = isDarkColor(contact.creator?.profile.user_avatar_color);
                            const textColorClass = isDark ? 'text-white' : 'text-black';

                            return(
                                <div key={contact.id} className="relative bg-app-white min-h-128 rounded-md border border-app-dark-white">
                                    <div className="pt-5 pb-5 pl-10 pr-10">
                                        <div>
                                            <figure className="relative m-auto h-24 w-24 rounded-full" style={{ backgroundColor: contact.creator?.profile.user_avatar_color }}>
                                                <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-2xl ${textColorClass}`}>
                                                    {initials}
                                                </span>
                                            </figure>
                                        </div>

                                        <div className="mt-6 text-center">
                                            <span className="block text-lg mb-2 font-medium text-app-dark">{contact.creator?.profile.name} {contact.creator?.profile.surname}</span>
                                            <span className="block text-sm mb-2 font-regular text-app-silver">{contact.creator?.profile.username}</span>
                                            <span className="block text-sm mb-2 font-regular text-app-silver">{contact.creator?.email}</span>
                                        </div>

                                        <div className="mt-6 flex gap-2 justify-center">
                                            <Button type="button" uiType="primary" size="extraSmallSize" onClick={() => handleAcceptInvitation(contact.id)}>Akceptuj</Button>
                                            <Button type="button" uiType="dark" size="extraSmallSize" onClick={() => handleRejectInvitation(contact.id)}>Usuń</Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
};

export default ContactsInvitationsList;