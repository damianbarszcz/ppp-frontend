import Link from "next/link";
import React from "react";

interface ChannelListProps {
    teams: any[];
}

const ChannelList: React.FC<ChannelListProps> = ({ teams }) => {

    return (
        <section className="w-full">
            <div className="m-auto max-w-6xl">
                <div className="grid grid-cols-3 mt-10 mb-20 w-full gap-6">
                    {teams.map(team => (

                    <div key={team.id} className="flex flex-col justify-between global--border-d-white rounded-md p-4">
                        <div className="flex content-center items-center">
                            <figure className="relative w-16 h-16 rounded-lg" style={{ backgroundColor: team.team_details.team_avatar_color }}>
                                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-base">RS</span>
                            </figure>
                            <div className="ml-5">
                                <h2 className="font-body text-base">{team.title}</h2>
                            </div>
                        </div>

                        <div className="mt-4 w-full h-px global--bg-d-white"></div>

                        <div className="mt-5">
                            <div>
                                <p className="font-body text-sm global--text-silver">
                                    {team.team_details.description}
                                </p>
                            </div>
                            <div className="flex mt-5">
                                <span className="block pt-1.5 pb-1.5 pl-3 pr-3 font-body text-sm global--bg-d-white rounded-sm text-center global--text-d-silver">
                                    {team.team_details.tags}
                                </span>
                            </div>

                            <div className="mt-10 flex justify-end">
                                <Link href="/member/channels/manage" className="block pt-2 pb-2 pl-6 pr-6 mr-5 global--border-silver rounded-3xl
                                    text-sm font-body font-semibold global--text-silver" target="_self"> Zarządzaj </Link>
                                <a href={`/member/channels/channel/${team.slug}`} className="block pt-2 pb-2 pl-6 pr-6 global--border-blue rounded-3xl
                                    text-sm font-body font-semibold global--text-link" target="_self"> Dołącz </a>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default  ChannelList;