import React, { useState, useEffect } from "react";
import Button from "@/app/components/ui/Button";
import {MatchedPerson, SearchResults} from "@/app/types";

interface RecommendedPeopleListProps {
    onRestartSearch?: () => void;
}

export function getInitials(channelTitle: string): string {
    if (!channelTitle) return '';
    const words = channelTitle.split(' ');
    return words.length > 1 ? words[0][0] + words[1][0] : channelTitle.slice(0, 2);
}

const RecommendedPeopleList: React.FC<RecommendedPeopleListProps> = ({
    onRestartSearch
}: RecommendedPeopleListProps) => {
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSearchResults();
    }, []);

    const loadSearchResults = () => {
        try {
            const searchError = sessionStorage.getItem('searchError');
            if (searchError) {
                sessionStorage.removeItem('searchError');
                setError(searchError);
                setIsLoading(false);
                return;
            }

            const resultsData = sessionStorage.getItem('searchResults');
            const searchId = sessionStorage.getItem('searchId');

            if (resultsData) {
                const results: SearchResults = JSON.parse(resultsData);
                setSearchResults(results);
                setIsLoading(false);
            } else if (searchId) {
                setError('Nie znaleziono wyników wyszukiwania. Spróbuj ponownie.');
                setIsLoading(false);
            } else {
                setError('Brak danych wyszukiwania. Rozpocznij nowe wyszukiwanie.');
                setIsLoading(false);
            }
        } catch (error) {
            setError('Wystąpił błąd podczas ładowania wyników.');
            setIsLoading(false);
        }
    };

    const handleRestartSearch = () => {
        sessionStorage.removeItem('searchResults');
        sessionStorage.removeItem('searchId');
        sessionStorage.removeItem('searchCriteria');
        sessionStorage.removeItem('searchError');
        if (onRestartSearch) {
            onRestartSearch();
        }
    };

    const renderPersonCard = (person: MatchedPerson, isMentor: boolean = false) => (
        <div key={person.user_id} className="relative bg-app-white min-h-128 rounded-md border border-app-dark-white hover:shadow-lg transition-shadow duration-300">
            {isMentor && person.is_premium && (
                <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                        MENTOR+
                    </div>
                </div>
            )}

            <div className="pt-5 pb-5 pl-6 pr-6">
                <div className="text-center">
                    <figure className="relative m-auto h-20 w-20 rounded-full flex items-center justify-center" style={{ backgroundColor: person.avatar_color }}>
                        <span className="font-body font-semibold text-xl text-white">
                            {getInitials(person.name)}
                        </span>
                    </figure>
                </div>

                <div className="mt-4 text-center">
                    <span className="block text-lg mb-1 font-medium text-app-dark">{person.name}</span>
                    <span className="block text-sm mb-1 font-regular text-app-silver">@{person.username}</span>
                    {person.specialization && ( <span className="block text-sm mb-2 font-medium text-app-dark">{person.specialization}</span>)}
                    {person.location && (<span className="block text-xs mb-2 text-app-silver">{person.location}</span>)}

                    <div className="mb-3">
                        <div className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${
                            person.match_score >= 80 ? 'bg-green-100 text-app-dark' :
                                person.match_score >= 60 ? 'bg-yellow-100 text-app-dark' :
                                    'bg-orange-100 text-orange-700'}`}>
                            Dopasowanie: {person.match_score}%
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <Button type="button" uiType="primary" size="regularSize">
                        {isMentor ? 'Zobacz profil' : 'Wyślij zaproszenie'}
                    </Button>
                </div>
            </div>
        </div>
    );

    const renderLoadingState = () => (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-app-silver">Ładowanie wyników wyszukiwania...</p>
            </div>
        </div>
    );

    const renderErrorState = () => (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center max-w-md">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold text-app-dark mb-4">Wystąpił problem</h2>
                <p className="text-app-silver mb-6">{error}</p>
                <Button type="button" uiType="primary" size="regularSize" onClick={handleRestartSearch}>
                    Rozpocznij nowe wyszukiwanie
                </Button>
            </div>
        </div>
    );

    const renderEmptyState = () => (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center max-w-md">
                <div className="text-gray-400 text-5xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold text-app-dark mb-4">Brak wyników</h2>
                <p className="text-app-silver mb-6">
                    Nie znaleźliśmy żadnych dopasowań dla Twoich kryteriów.
                    Spróbuj zmienić parametry wyszukiwania.
                </p>
                <Button type="button" uiType="primary" size="regularSize" onClick={handleRestartSearch}>
                    Spróbuj ponownie
                </Button>
            </div>
        </div>
    );

    if (isLoading) {
        return renderLoadingState();
    }
    if (error) {
        return renderErrorState();
    }
    if (!searchResults || searchResults.total_matches === 0) {
        return renderEmptyState();
    }

    const { mentors, partners} = searchResults;

    const filteredMentors = mentors.filter(mentor => mentor.match_score >= 60);
    const filteredPartners = partners.filter(partner => partner.match_score >= 60);

    if (filteredMentors.length === 0 && filteredPartners.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-gray-400 text-5xl mb-4">🔍</div>
                    <h2 className="text-xl font-semibold text-app-dark mb-4">Brak wysokiej jakości dopasowań</h2>
                    <p className="text-app-silver mb-6">
                        Nie znaleźliśmy dopasowań o jakości 60% lub wyższej.
                        Spróbuj zmienić kryteria wyszukiwania.
                    </p>
                    <Button type="button" uiType="primary" size="regularSize" onClick={handleRestartSearch}>
                        Spróbuj ponownie
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <section className="py-8">
            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-8 rounded-lg">
                    <h1 className="text-2xl font-bold text-app-dark mb-2">Wyniki wyszukiwania</h1>
                </header>

                {filteredMentors.length > 0 && (
                    <div className="mb-12">
                        <header className="mb-8">
                            <div className="flex items-center justify-between">
                                <header>
                                    <h2 className="text-lg font-bold text-app-dark mb-2">
                                        Rekomendowani mentorzy ({filteredMentors.length})
                                    </h2>
                                    <p className="text-base text-app-silver">
                                        Eksperci z dopasowaniem 60%+. Posortowani według jakości dopasowania.
                                    </p>
                                </header>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredMentors.map(mentor => renderPersonCard(mentor, true))}
                        </div>
                    </div>
                )}

                {filteredPartners.length > 0 && (
                    <>
                        {filteredMentors.length > 0 && <div className="border-t border-app-dark-white my-12"></div>}

                        <div className="mb-12">
                            <header className="mb-8">
                                <h2 className="text-lg font-semibold text-app-dark mb-2">
                                    Rekomendowani partnerzy do zespołu ({filteredPartners.length})
                                </h2>
                                <p className="text-base text-app-silver">
                                    Użytkownicy z dopasowaniem 60%+
                                </p>
                            </header>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredPartners.map(partner => renderPersonCard(partner, false))}
                            </div>
                        </div>
                    </>
                )}

                <div className="mt-16 text-center">
                    <div className="bg-gray-50 rounded-lg p-8">
                        <h3 className="text-xl font-semibold text-app-dark mb-4">
                            Nie znalazłeś idealnego partnera?
                        </h3>

                        <p className="text-app-silver mb-6 max-w-[600px] text-center m-auto">
                            Pokazujemy tylko dopasowania o jakości 60% lub wyższej.
                            Jeśli chcesz otrzymać nowe wyniki, spróbuj zmienić kryteria wyszukiwania.
                        </p>

                        <div className="flex justify-center space-x-4">
                            <Button type="button" uiType="primary" size="regularSize" onClick={handleRestartSearch}>
                                Szukaj ponownie
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecommendedPeopleList;