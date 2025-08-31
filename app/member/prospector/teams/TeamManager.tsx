import React from "react";
import Button from "@/app/components/ui/Button";
import {Team} from "@/app/types";

interface TeamManagerProps {
    teams: Team[];
    receivedInvitations: Team[];
    activeSection: string;
    setActiveSection: (section: string) => void;
    setTeamModalOpen: (open: boolean) => void;
}

const TeamManager: React.FC<TeamManagerProps > = ({
    teams,
    receivedInvitations,
    activeSection,
    setActiveSection,
    setTeamModalOpen
} : TeamManagerProps ) => {

    const handleSectionChange = (section: string) => {
        setActiveSection(section);
    };

    return (
        <section className="w-full">
            <div className="m-auto max-w-6xl pt-10">
                <header className="w-full">
                    <h1 className="text-3xl font-bold leading-[100px] global--text-dark">Zespoły</h1>

                    <p className="text-lg font-regular global--text-silver">
                        Miejsce w którym możesz tworzyć i dołączać do zespołów.
                    </p>
                </header>

                <div className="flex items-end pt-10 ">
                    <div className="mt-8 w-full">
                        <ul className="flex relative space-x-3 list-none">
                            <li className="relative pr-3">
                                <button type="button" className={`${activeSection == 'all' ? 'text-app-blue' : 'text-app-silver'}  text-base font-medium`}
                                        onClick={() => handleSectionChange('all')}>
                                    Twoje zespoły ({teams.length})
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
                        <Button type="button" uiType="primary" size="regularSize" onClick={() => setTeamModalOpen(true)}>
                            Stwórz zespół
                        </Button>
                    </div>
                </div>

                <div className="mt-4 w-full h-px bg-app-dark-white"></div>
            </div>
        </section>
    );
};

export default TeamManager;