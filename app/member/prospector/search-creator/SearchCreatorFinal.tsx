import React from "react";

interface Person {
    id: number;
    initials: string;
    name: string;
    specialization: string;
    location: string;
    rating: number;
    reviewsCount: number;
    description: string;
    tags: string[];
}

interface RecommendedPeopleListProps {
    people?: Person[];
    nextStage: () => void;
}

const RecommendedPeopleList: React.FC<RecommendedPeopleListProps> = ({nextStage,
    people = [
       {
           id: 1,
           initials: "AK",
           name: "Anna Kowalska",
           specialization: "Księgowa",
           location: "Warszawa, Mokotów",
           rating: 4.8,
           reviewsCount: 127,
           description: "Specjalizuję się w obsłudze małych i średnich przedsiębiorstw. 15 lat doświadczenia w branży.",
          tags: ["KPiR", "Ryczałt", "VAT", "JPK"]
       },
       {
          id: 2,
          initials: "MN",
          name: "Marek Nowak",
          specialization: "Doradca Podatkowy",
          location: "Kraków, Centrum",
          rating: 4.9,
          reviewsCount: 89,
          description: "Pomogę w optymalizacji podatkowej i rozliczeniach. Obsługuję spółki z o.o. oraz JDG.",
          tags: ["CIT", "PIT", "Optymalizacja", "Spółki"]
       },
       {
         id: 3,
         initials: "EW",
         name: "Ewa Wiśniewska",
         specialization: "Księgowa",
         location: "Wrocław, Krzyki",
         rating: 4.7,
         reviewsCount: 156,
         description: "Oferuję kompleksową obsługę księgową dla firm. Specjalizacja: e-commerce i IT.",
         tags: ["E-commerce", "IT", "Księgi handlowe", "ZUS"]
       }
    ]
}) => {
    return (
        <div className="h-full max-w-4xl m-auto flex flex-col">
            <div className="flex flex-col pt-12 pb-12 pr-10 pl-10 global--border-d-white rounded-md">
                <header className="mb-8">
                    <h1 className="font-body text-3xl font-bold global--text-dark">
                        Rekomendowani Księgowi
                    </h1>
                    <p className="font-body text-base font-regular global--text-silver leading-[30px] mt-4">
                        Wybierz eksperta, który najlepiej odpowiada Twoim potrzebom
                    </p>
                </header>

                <div className="space-y-4">
                    {people.map((person) => (
                        <div
                            key={person.id}
                            className="global--border-d-white rounded-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        >
                            <div className="flex items-start space-x-4">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 global--bg-blue rounded-full flex items-center justify-center text-white font-bold text-xl">
                                        {person.initials}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-body text-xl font-semibold global--text-dark">
                                                {person.name}
                                            </h3>
                                            <p className="font-body text-sm global--text-silver mt-1">
                                                {person.specialization} • {person.location}
                                            </p>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center">
                                                <span className="text-yellow-500">★</span>
                                                <span className="font-body text-sm font-semibold global--text-dark ml-1">
                                                    {person.rating}
                                                </span>
                                            </div>
                                            <span className="font-body text-sm global--text-silver">
                                                ({person.reviewsCount} opinii)
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="font-body text-base global--text-silver mt-3 leading-relaxed">
                                        {person.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {person.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 text-xs font-body font-medium global--text-link global--border-blue rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Contact Button */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <button className="font-body text-sm font-semibold global--text-link hover:underline">
                                            Zobacz profil
                                        </button>
                                        <button className="pt-2 pb-2 pl-6 pr-6 global--border-blue rounded-3xl text-sm font-body font-semibold global--text-link hover:global--bg-blue hover:text-white transition-colors">
                                            Skontaktuj się
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                <div className="mt-8 text-center">
                    <button className="pt-3 pb-3 pl-8 pr-8 global--border-blue rounded-3xl text-sm font-body font-semibold global--text-link">
                        Pokaż więcej
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecommendedPeopleList;