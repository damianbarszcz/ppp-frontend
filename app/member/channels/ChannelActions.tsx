import React from "react";

interface ChannelActionsProps{
    setModalOpen: (open: boolean) => void;
}

const ChannelActions : React.FC<ChannelActionsProps> = ({
    setModalOpen,
    }: ChannelActionsProps) => {
    return (
        <section className="w-full">
            <div className="m-auto max-w-6xl">
                <div className="flex justify-between items-end pt-20 w-full">
                    <header>
                        <h1 className="font-body text-3xl font-bold leading-[75px] global--text-dark">Zespoły</h1>
                        <p className="font-body text-lg font-regular global--text-silver">
                            Miejsce w którym możesz tworzyć i dołączać do zespołów.
                        </p>
                    </header>

                    <div>
                        <button type="button" className="flex relative pl-4 pr-4 pt-2 pb-2 global--border-blue rounded-sm
                            text-sm font-body font-semibold global--text-link">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3861DA" className="-translate-x-2">
                                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                            </svg>
                            <span className="block leading-[23px]" onClick={() => setModalOpen(true)}>Nowy zespół</span>
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-end pt-20 w-full">
                    <div className="w-full">
                        <ul className="flex relative space-x-3 list-none">
                            <li className="relative pr-3">
                                <button type="button" className="text-base font-medium font-body global--text-link">
                                    Wszystkie
                                </button>
                            </li>

                            <li className="relative pr-3 pl-3">
                                <button type="button" className="text-base font-medium font-body global--text-silver">
                                    Utworzone
                                </button>
                            </li>

                            <li className="relative pr-3 pl-3">
                                <button type="button" className="text-base font-medium font-body global--text-silver">
                                    Zaproszenia
                                </button>
                            </li>
                        </ul>

                        <div className="mt-4 w-full h-px global--bg-d-white"></div>
                    </div>

                    <div className="">

                    </div>
                </div>
            </div>
        </section>
    );
}

export default  ChannelActions;