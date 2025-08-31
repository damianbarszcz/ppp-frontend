import React from "react";
import Button from "@/app/components/ui/Button";

interface ChannelListProps {
    teams: any[];
    setTeamModalOpen: (open: boolean) => void;
}

export function getInitials(channelTitle: string): string {
    if (!channelTitle) return '';
    const words = channelTitle.split(' ');
    return words.length > 1 ? words[0][0] + words[1][0] : channelTitle.slice(0, 2);
}

const YourTeamList: React.FC<ChannelListProps> = ({ teams,setTeamModalOpen } : ChannelListProps) => {
    return (
        <section className="w-full">
            <div className="m-auto max-w-6xl">
                {teams.length > 0 ? (
                    <div className="grid grid-cols-3 mt-10 mb-20 w-full gap-6">
                        {teams.map((team) => (
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

                                    <div className="mt-10 flex justify-end">
                                        <a href={`/member/prospector/teams/channel/${encodeURIComponent(team.slug)}`}
                                           className="block pt-2 pb-2 pl-6 pr-6 global--border-blue rounded-3xl text-sm font-semibold text-app-blue">
                                            Dołącz
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-10 mb-10 w-full p-10">
                        <div className="flex m-auto flex-col">
                            <header className="text-center">
                                <h1 className="font-body text-2xl font-semibold global--text-dark">Zespoły</h1>
                                <p className="mt-5 font-body text-lg global--text-silver">Aktualnie nie masz dostępu do żadnego zespołu</p>
                            </header>

                            <div className="m-auto mt-10">
                                <Button type="button" uiType="primary" size="regularSize" onClick={() => setTeamModalOpen(true)}>
                                    Stwórz zespół
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default  YourTeamList;