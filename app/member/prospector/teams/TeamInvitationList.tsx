import React from "react";
import {Team} from "@/app/types";
import Button from "@/app/components/ui/Button";

interface TeamInvitationListProps {
    invitations: Team[];
    receivedInvitations: Team[];
    handleAcceptInvitation: (teamId: number) => void;
    handleRejectInvitation: (teamId: number) => void;
}

export function getInitials(channelTitle: string): string {
    if (!channelTitle) return '';
    const words = channelTitle.split(' ');
    return words.length > 1 ? words[0][0] + words[1][0] : channelTitle.slice(0, 2);
}

const TeamInvitationsList: React.FC<TeamInvitationListProps> = ({
    invitations,
    receivedInvitations,
    handleAcceptInvitation,
    handleRejectInvitation
}: TeamInvitationListProps) => {

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
        <section className="w-full">
            <div className="m-auto max-w-6xl">
                {receivedInvitations.length > 0 && (
                    <div className="max-w-6xl mx-auto mt-10">
                        <header className="mb-10">
                            <h2 className="font-medium">Zaproszenia dla Ciebie:</h2>
                        </header>

                        <div className="grid grid-cols-3 mt-10 mb-20 w-full gap-6">
                            {receivedInvitations.map((team: Team) => {
                                return(
                                    <div key={team.id} className="flex flex-col justify-between global--border-d-white rounded-md p-4">
                                        <div className="flex content-center items-center">
                                            <figure className="relative w-16 h-16 rounded-lg" style={{ backgroundColor: team.team_details.team_avatar_color }}>
                                                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-semibold text-base">{getInitials(team.title)}</span>
                                            </figure>

                                            <div className="ml-5">
                                                <h2 className="text-base font-medium text-app-dark">{team.title}</h2>
                                            </div>
                                        </div>

                                        <div className="mt-4 w-full h-px global--bg-d-white"></div>

                                        <div className="mt-5">
                                            <div>
                                                <p className="text-sm text-app-silver">
                                                    {team.team_details.description}
                                                </p>
                                            </div>

                                            <div className="mt-6 flex justify-end">
                                                <div className="flex justify-center gap-2 max-w-[200px]">
                                                    <Button type="button" uiType="primary" size="extraSmallSize" onClick={() => handleAcceptInvitation(team.id)}>Akceptuj</Button>
                                                    <Button type="button" uiType="dark" size="extraSmallSize" onClick={() => handleRejectInvitation(team.id)}>Usuń</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default TeamInvitationsList;