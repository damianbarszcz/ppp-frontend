import React from "react";
import Input from "@/app/components/ui/Input";
import Link from "next/link";
import {getInitials} from "@/app/components/utils/avatar";
import {isDarkColor} from "@/app/components/utils/color";

interface User {
    id: number;
    email: string;
    account_type: string;
    name:string;
    surname:string;
    user_avatar_color: string;
}

interface ProspectorDashboardProps{
    user: User
}

const ProspectorHome : React.FC<ProspectorDashboardProps> = ({
    user
} : ProspectorDashboardProps) => {
    const initials = getInitials(user.name, user.surname);
    const isDark = isDarkColor(user.user_avatar_color);
    const textColorClass = isDark ? 'text-white' : 'text-black';

    return (
            <main>
                <section className="w-full">
                    <div className="max-w-6xl m-auto mt-10 text-center">
                        <figure className="relative m-auto h-24 w-24 rounded-full" style={{ backgroundColor: user.user_avatar_color }}>
                            <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-4xl ${textColorClass}`}>
                                {initials}
                            </span>
                        </figure>

                        <div className="mt-5 m-auto max-w-xl">
                            <h1 className="font-body text-2xl font-regular global--text-dark">Witaj, <span className="font-semibold">{user.name} {user.surname}</span></h1>
                            <p className={`mt-5 font-body text-base/7 global--text-silver`}>
                                Odkrywaj nowe możliwości, dziel się wiedzą i rozwijaj swoje kompetencje
                                w gronie ekspertów działających w aplikacji PPP.
                            </p>
                        </div>
                    </div>

                    <div className="m-auto mt-5 w-full max-w-[800px]">
                        <form onSubmit={(e) => { e.preventDefault();  }} className="relative">
                            <Input
                                isLabel={false}
                                labelCaption=""
                                name="account-search"
                                type="search"
                                placeholder="Co chciałbyś znaleźć ?"
                                uiType="light"
                                value=""
                                validateError=""
                            />

                            <button type="submit" className="absolute top-3 right-6">
                                <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#5F6368">
                                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14
                                    83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                                </svg>
                            </button>
                        </form>
                    </div>

                    <div className="mt-10 m-auto grid grid-cols-2 gap-4 w-full max-w-[800px]">
                        <div className="flex flex-col justify-between min-h-54 global--border-d-white rounded-md">
                            <div className="p-6 mr-12">
                                <h2 className="font-body text-xl font-semibold global--text-dark">Profil współpracownika</h2>
                                <p className="mt-3 font-body text-sm/7 font-normal global--text-silver">
                                    Profil współpracownika pomaga innym znaleźć
                                    Cię jako potencjalnego partnera do wspólnej pracy.
                                </p>
                            </div>

                            <div>
                                <div className="w-full h-px global--bg-d-white"></div>

                                <div className="w-full">
                                    <Link href="/member/profile" className="block pl-6 pr-6 pt-3 pb-3
                                    text-base font-semibold font-body global--text-link" target="_self">
                                        Zarządzaj swoim profilem
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between min-h-54 global--border-d-white rounded-md">
                            <div className="p-6 mr-16">
                                <h2 className="font-body text-xl font-semibold global--text-dark">Kreator poszukiwań</h2>
                                <p className="mt-3 font-body text-sm/7 font-normal global--text-silver">
                                    Kreator poszukiwań pomoże Ci znaleźć idealnych mentorów i partnerów do współpracy – dopasowanych do twoich oczekiwań.
                                </p>
                            </div>

                            <div>
                                <div className="w-full h-px global--bg-d-white"></div>

                                <div className="w-full">
                                    <Link href="/member/search-creator" className="block pl-6 pr-6 pt-3 pb-3 text-base
                                    font-semibold font-body global--text-link hover:global--bg-d-white" target="_self">
                                        Rozpocznij
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between  min-h-54 global--border-d-white rounded-md col-span-2">
                            <div className="p-6 mr-16">
                                <h2 className="font-body text-xl font-semibold global--text-dark">Kanały komunikacji</h2>
                                <p className="mt-3 font-body text-sm/7 font-normal global--text-silver">
                                    Miejsca stworzone przez użytkowników do rozmów, wymiany pomysłów i wspólnej pracy.
                                    Dołącz lub stwórz własny kanał i zacznij współdziałać z innymi.
                                </p>
                            </div>

                            <div>
                                <div className="w-full h-px global--bg-d-white"></div>

                                <div className="w-full">
                                    <Link href="/member/channels" className="block pl-6 pr-6 pt-3 pb-3 text-base font-semibold font-body global--text-link"
                                          target="_self">
                                        Zarządzaj kanałami komunikacji
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
    );
}

export default  ProspectorHome;