import React from "react";
import Button from "@/app/components/ui/Button";

interface RecommendedPeopleListProps {

}

export function getInitials(channelTitle: string): string {
    if (!channelTitle) return '';
    const words = channelTitle.split(' ');
    return words.length > 1 ? words[0][0] + words[1][0] : channelTitle.slice(0, 2);
}

interface Person {
    id: number;
    name: string;
    username: string;
    email: string;
    avatarColor: string;
    specialization: string;
    isPremium?: boolean;
    rating?: number;
    location?: string;
}

const RecommendedPeopleList: React.FC<RecommendedPeopleListProps> = ({ } : RecommendedPeopleListProps) => {

    const mentors: Person[] = [
        {
            id: 1,
            name: "Anna Kowalska",
            username: "annakowalska",
            email: "anna.kowalska@example.com",
            avatarColor: "#6366f1",
            specialization: "Senior React Developer",
            isPremium: true,
            rating: 4.9,
            location: "Warszawa"
        },
        {
            id: 2,
            name: "Marcin Nowak",
            username: "marcinnowak",
            email: "marcin.nowak@example.com",
            avatarColor: "#10b981",
            specialization: "Tech Lead & Architect",
            isPremium: true,
            rating: 4.8,
            location: "Kraków"
        },
        {
            id: 3,
            name: "Ewa Wiśniewska",
            username: "ewawis",
            email: "ewa.wisniewska@example.com",
            avatarColor: "#f59e0b",
            specialization: "Product Manager",
            isPremium: false,
            rating: 4.6,
            location: "Gdańsk"
        },
        {
            id: 4,
            name: "Tomasz Kowal",
            username: "tomaszk",
            email: "tomasz.kowal@example.com",
            avatarColor: "#ef4444",
            specialization: "UX/UI Designer",
            isPremium: false,
            rating: 4.5,
            location: "Wrocław"
        }
    ];

    const partners: Person[] = [
        {
            id: 5,
            name: "Damian Barszcz",
            username: "damianbarszcz",
            email: "damianbarszcz@gmail.com",
            avatarColor: "#ff0000",
            specialization: "Frontend Developer"
        },
        {
            id: 6,
            name: "Karolina Maj",
            username: "karolinamaj",
            email: "karolina.maj@example.com",
            avatarColor: "#8b5cf6",
            specialization: "Backend Developer"
        },
        {
            id: 7,
            name: "Piotr Zieliński",
            username: "piotrziel",
            email: "piotr.zielinski@example.com",
            avatarColor: "#06b6d4",
            specialization: "DevOps Engineer"
        },
        {
            id: 8,
            name: "Magdalena Król",
            username: "magdakrol",
            email: "magdalena.krol@example.com",
            avatarColor: "#84cc16",
            specialization: "Marketing Specialist"
        },
        {
            id: 9,
            name: "Jakub Nowacki",
            username: "jakubnow",
            email: "jakub.nowacki@example.com",
            avatarColor: "#f97316",
            specialization: "Data Analyst"
        },
        {
            id: 10,
            name: "Natalia Sikora",
            username: "nataliasik",
            email: "natalia.sikora@example.com",
            avatarColor: "#ec4899",
            specialization: "Graphic Designer"
        }
    ];

    const sortedMentors = [...mentors].sort((a, b) => {
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        return (b.rating || 0) - (a.rating || 0);
    });

    const renderPersonCard = (person: Person, isMentor: boolean = false) => (
        <div key={person.id} className="relative bg-app-white min-h-128 rounded-md border border-app-dark-white hover:shadow-lg transition-shadow duration-300">
            {isMentor && person.isPremium && (
                <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                        MENTOR+
                    </div>
                </div>
            )}

            <div className="pt-5 pb-5 pl-6 pr-6">
                <div className="text-center">
                    <figure className="relative m-auto h-20 w-20 rounded-full flex items-center justify-center" style={{ backgroundColor: person.avatarColor }}>
                        <span className="font-body font-semibold text-xl text-white">
                            {getInitials(person.name)}
                        </span>
                    </figure>
                </div>

                <div className="mt-4 text-center">
                    <span className="block text-lg mb-1 font-medium text-app-dark">{person.name}</span>
                    <span className="block text-sm mb-1 font-regular text-app-silver">@{person.username}</span>
                    <span className="block text-xs mb-2 font-regular text-app-silver break-all">{person.email}</span>
                </div>

                <div className="mt-4 text-center">
                    <Button type="button" uiType="primary" size="regularSize">{isMentor ? 'Zobacz profil' : 'Wyślij zaproszenie'}</Button>
                </div>
            </div>
        </div>
    );

    return (
        <section className="py-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12">
                    <header className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-bold text-app-dark mb-2">Rekomendowani mentorzy</h1>
                                <p className="text-base text-app-silver">Eksperci, którzych warto śledzić. Dostosowani do twoich potrzeb.</p>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedMentors.map(mentor => renderPersonCard(mentor, true))}
                    </div>
                </div>

                <div className="border-t border-app-dark-white my-12"></div>

                <div>
                    <header className="mb-8">
                        <div>
                            <h2 className="text-xl font-semibold text-app-dark mb-2">Rekomendowani partnerzy do zespołu</h2>
                            <p className="text-base text-app-silver">Użytkownicy gotowi do współpracy. Możesz wysłać im zaproszenie do współpracy.</p>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {partners.map(partner => renderPersonCard(partner, false))}
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <div className="bg-gray-50 rounded-lg p-8">
                        <h3 className="text-xl font-semibold text-app-dark mb-4">Nie znalazłeś idealnego partnera?</h3>

                        <p className="text-app-silver mb-6 max-w-[600px] text-center m-auto">
                            Jeśli chcesz dostać nowa liste partnerów do współpracy i mentorów musisz ponownie przejśc przez kreator poszukiwań.
                        </p>

                        <div className="flex justify-center space-x-4">
                            <Button type="button" uiType="primary" size="regularSize">Szukaj ponownie</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecommendedPeopleList;