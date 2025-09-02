import React, { useState } from "react";
import Button from "@/app/components/ui/Button";

interface SearchCreatorStage2Props {
    nextStage: () => void;
    updateFormData: (data: any) => void;
    formData: any;
}

interface CollaborationArea {
    id: string;
    title: string;
    description: string;
}

const COLLABORATION_AREAS: CollaborationArea[] = [
    {
        id: 'product-development',
        title: 'Rozwój produktu/usługi',
        description: 'Tworzenie i rozwijanie produktów'
    },
    {
        id: 'marketing-sales',
        title: 'Marketing i sprzedaż',
        description: 'Promocja, reklama, pozyskiwanie klientów'
    },
    {
        id: 'technology',
        title: 'Technologia i rozwój',
        description: 'Programowanie, IT, rozwiązania techniczne'
    },
    {
        id: 'management',
        title: 'Zarządzanie i operacje',
        description: 'Kierowanie zespołem, procesy biznesowe'
    },
    {
        id: 'finance',
        title: 'Finanse i księgowość',
        description: 'Zarządzanie finansami, księgowość, podatki'
    },
    {
        id: 'design',
        title: 'Design i kreatywność',
        description: 'Projektowanie, UX/UI, treści kreatywne'
    },
    {
        id: 'legal',
        title: 'Prawo i compliance',
        description: 'Obsługa prawna, zgodność z przepisami'
    },
    {
        id: 'logistics',
        title: 'Logistyka i supply chain',
        description: 'Zarządzanie łańcuchem dostaw, transport'
    },
    {
        id: 'content',
        title: 'Content i copywriting',
        description: 'Tworzenie treści, tekstów, komunikacji'
    },
    {
        id: 'analytics',
        title: 'Analityka danych',
        description: 'Analiza danych, reporting, BI'
    },
    {
        id: 'customer-service',
        title: 'Obsługa klienta',
        description: 'Wsparcie klientów, CRM, relacje'
    },
    {
        id: 'quality',
        title: 'Jakość i testowanie',
        description: 'QA, kontrola jakości, audyty'
    }
];

const SearchCreatorStage2: React.FC<SearchCreatorStage2Props> = ({
                                                                     nextStage,
                                                                     updateFormData,
                                                                     formData
                                                                 }) => {
    const [selectedAreas, setSelectedAreas] = useState<string[]>(
        formData.collaborationAreas || []
    );

    const toggleArea = (areaId: string) => {
        const newAreas = selectedAreas.includes(areaId)
            ? selectedAreas.filter(a => a !== areaId)
            : [...selectedAreas, areaId];

        setSelectedAreas(newAreas);
        updateFormData({ collaborationAreas: newAreas });
    };

    const canProceed = selectedAreas.length > 0;

    return (
        <div className="max-w-5xl min-h-[90vh] max-h-[90vh] m-auto flex flex-col py-10 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col justify-between flex-1 global--border-d-white rounded-md p-10">
                <header>
                    <h1 className="text-2xl font-bold text-app-dark mb-4">Obszar współpracy</h1>
                    <p className="text-base font-regular text-app-silver leading-[30px]">
                        Wybierz obszary w których szukasz wsparcia lub chcesz współpracować.
                    </p>
                </header>

                <div className="flex-1">
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Interesujące obszary</h2>
                            <p className="text-sm text-app-silver mb-4">
                                Wybierz wszystkie obszary, które Cię interesują:
                            </p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {COLLABORATION_AREAS.map(area => (
                                <div
                                    key={area.id}
                                    onClick={() => toggleArea(area.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedAreas.includes(area.id)
                                            ? 'global--border-blue global--bg-light-blue'
                                            : 'global--border-d-white hover:global--border-silver'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <header>
                                            <h3 className="font-semibold text-app-dark">{area.title}</h3>
                                            <p className="text-sm text-app-silver">{area.description}</p>
                                        </header>
                                        <input
                                            type="checkbox"
                                            checked={selectedAreas.includes(area.id)}
                                            onChange={() => {}}
                                            className="text-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sekcja dodatkowa - co oferujesz vs czego szukasz */}
                    <div className="mt-10 mb-10">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-app-dark mb-4">
                                Wskazówka
                            </h3>
                            <p className="text-sm text-app-silver leading-relaxed">
                                Wybierz obszary w których:
                            </p>
                            <ul className="text-sm text-app-silver mt-2 space-y-1">
                                <li>• <strong>Potrzebujesz wsparcia</strong> - szukasz ekspertów którzy Ci pomogą</li>
                                <li>• <strong>Możesz pomóc innym</strong> - masz doświadczenie do dzielenia się</li>
                                <li>• <strong>Chcesz się rozwijać</strong> - interesuje Cię nauka nowych umiejętności</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-app-silver">
                        {selectedAreas.length > 0 && (
                            <span>Wybrano: {selectedAreas.length} obszar{selectedAreas.length > 1 ? 'ów' : ''}</span>
                        )}
                    </div>

                    <Button
                        type="button"
                        uiType="primary"
                        size="regularSize"
                        onClick={nextStage}
                        disabled={!canProceed}
                    >
                        Dalej
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SearchCreatorStage2;