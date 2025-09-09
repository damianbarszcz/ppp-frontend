import React, { useState } from "react";
import Button from "@/app/components/ui/Button";
import {
    PROJECT_TYPES,
    TIME_COMMITMENTS,
    WORK_MODES,
    BUDGET_RANGES
} from "@/app/constans/profileContans";

interface SearchCreatorStage5Props {
    nextStage: () => void;
    updateFormData: (data: any) => void;
    formData: any;
}

const SearchCreatorStage4: React.FC<SearchCreatorStage5Props> = ({
                                                                     nextStage,
                                                                     updateFormData,
                                                                     formData
                                                                 }) => {
    const [selectedProjectType, setSelectedProjectType] = useState<string>(
        formData.project_type || ''
    );
    const [selectedTimeCommitment, setSelectedTimeCommitment] = useState<string>(
        formData.time_commitment || ''
    );
    const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>(
        formData.work_modes || []
    );
    const [selectedBudgetRange, setSelectedBudgetRange] = useState<string>(
        formData.budget_range || ''
    );
    const [location, setLocation] = useState<string>(
        formData.location || ''
    );
    const [additionalNotes, setAdditionalNotes] = useState<string>(
        formData.additional_notes || ''
    );
    const [isSearching, setIsSearching] = useState(false);

    const handleProjectTypeSelect = (typeId: string) => {
        setSelectedProjectType(typeId);
        updateFormData({ project_type: typeId });
    };

    const handleTimeCommitmentSelect = (commitmentId: string) => {
        setSelectedTimeCommitment(commitmentId);
        updateFormData({ time_commitment: commitmentId });
    };

    const toggleWorkMode = (modeId: string) => {
        const newModes = selectedWorkModes.includes(modeId)
            ? selectedWorkModes.filter(m => m !== modeId)
            : [...selectedWorkModes, modeId];

        setSelectedWorkModes(newModes);
        updateFormData({ work_modes: newModes });
    };

    const handleBudgetRangeSelect = (rangeId: string) => {
        setSelectedBudgetRange(rangeId);
        updateFormData({ budget_range: rangeId });
    };

    const handleLocationChange = (value: string) => {
        setLocation(value);
        updateFormData({ location: value });
    };

    const handleNotesChange = (value: string) => {
        setAdditionalNotes(value);
        updateFormData({ additional_notes: value });
    };

    const handleSubmitToMicroservice = async () => {
        if (!canProceed) return;

        setIsSearching(true);

        try {
            // Przygotuj dane do wysłania zgodne z bazą danych
            const searchCriteria = {
                timestamp: new Date().toISOString(),
                collaboration_areas: formData.collaboration_areas || [],
                experience_level: formData.experience_level || '',
                industries: formData.industries || [],
                required_skills: formData.required_skills || [],
                project_type: selectedProjectType,
                time_commitment: selectedTimeCommitment,
                work_modes: selectedWorkModes,
                budget_range: selectedBudgetRange,
                location: location || null,
                additional_notes: additionalNotes || null
            };

            console.log('Wysyłanie danych do AI:', searchCriteria);

            // Wywołanie do Python AI Microservice
            const response = await fetch(`${process.env.NEXT_PUBLIC_ALGORITHM_SERVICE_URL}/api/partner-matching`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(searchCriteria)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();

            if (result.success) {
                // Zapisz wyniki do sessionStorage
                sessionStorage.setItem('searchId', result.search_id);
                sessionStorage.setItem('searchCriteria', JSON.stringify(searchCriteria));
                sessionStorage.setItem('searchResults', JSON.stringify(result));

                console.log('Otrzymane wyniki:', result);
                nextStage();
            } else {
                throw new Error(result.message || 'Błąd wyszukiwania');
            }

        } catch (error) {
            console.error('Błąd podczas wysyłania do AI:', error);

            let errorMessage = 'Wystąpił błąd podczas wyszukiwania. ';

            if (error instanceof Error) {
                if (error.message.includes('Failed to fetch')) {
                    errorMessage += 'Nie można połączyć się z serwisem AI. Sprawdź połączenie internetowe.';
                } else if (error.message.includes('404')) {
                    errorMessage += 'Serwis AI jest niedostępny (404).';
                } else if (error.message.includes('500')) {
                    errorMessage += 'Błąd wewnętrzny serwisu AI.';
                } else {
                    errorMessage += error.message;
                }
            }

            // Zapisz błąd do sessionStorage żeby RecommendedPeopleList mógł go wyświetlić
            sessionStorage.setItem('searchError', errorMessage);

            // Mimo błędu, idź do następnego stage żeby wyświetlić error state
            nextStage();
        } finally {
            setIsSearching(false);
        }
    };

    const canProceed = selectedProjectType && selectedTimeCommitment &&
        selectedWorkModes.length > 0 && selectedBudgetRange;

    return (
        <div className="max-w-5xl min-h-[90vh] max-h-[90vh] m-auto flex flex-col py-10 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col justify-between flex-1 global--border-d-white rounded-md p-10">
                <header>
                    <h1 className="text-2xl font-bold text-app-dark mb-4">Format współpracy</h1>
                    <p className="text-base font-regular text-app-silver leading-[30px]">
                        Określ warunki i format współpracy z potencjalnymi partnerami.
                    </p>
                </header>

                <div className="flex-1">
                    {/* Sekcja 1: Rodzaj projektu */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Rodzaj projektu</h2>
                            <p className="text-sm text-app-silver mb-4">Wybierz rodzaj współpracy:</p>
                        </header>

                        <div className="grid grid-cols-1 gap-3">
                            {PROJECT_TYPES.map(type => (
                                <div
                                    key={type.id}
                                    onClick={() => handleProjectTypeSelect(type.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedProjectType === type.id
                                            ? 'global--border-blue global--bg-light-blue'
                                            : 'global--border-d-white hover:global--border-silver'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <header>
                                            <h3 className="font-semibold text-app-dark">{type.label}</h3>
                                            {type.description && (
                                                <p className="text-sm text-app-silver">{type.description}</p>
                                            )}
                                        </header>
                                        <input
                                            type="radio"
                                            name="projectType"
                                            checked={selectedProjectType === type.id}
                                            onChange={() => {}}
                                            className="text-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sekcja 2: Zaangażowanie czasowe */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Zaangażowanie czasowe</h2>
                            <p className="text-sm text-app-silver mb-4">Ile czasu ma poświęcać współpracownik:</p>
                        </header>

                        <div className="grid grid-cols-1 gap-3">
                            {TIME_COMMITMENTS.map(commitment => (
                                <div
                                    key={commitment.id}
                                    onClick={() => handleTimeCommitmentSelect(commitment.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedTimeCommitment === commitment.id
                                            ? 'global--border-blue global--bg-light-blue'
                                            : 'global--border-d-white hover:global--border-silver'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <header>
                                            <h3 className="font-semibold text-app-dark">{commitment.label}</h3>
                                            {commitment.description && (
                                                <p className="text-sm text-app-silver">{commitment.description}</p>
                                            )}
                                        </header>
                                        <input
                                            type="radio"
                                            name="timeCommitment"
                                            checked={selectedTimeCommitment === commitment.id}
                                            onChange={() => {}}
                                            className="text-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sekcja 3: Tryb pracy */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Tryb pracy</h2>
                            <p className="text-sm text-app-silver mb-4">Preferowane formaty pracy:</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {WORK_MODES.map(mode => (
                                <div
                                    key={mode.id}
                                    onClick={() => toggleWorkMode(mode.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedWorkModes.includes(mode.id)
                                            ? 'global--border-blue global--bg-light-blue'
                                            : 'global--border-d-white hover:global--border-silver'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <header>
                                            <h3 className="font-semibold text-app-dark">{mode.label}</h3>
                                            {mode.description && (
                                                <p className="text-sm text-app-silver">{mode.description}</p>
                                            )}
                                        </header>
                                        <input
                                            type="checkbox"
                                            checked={selectedWorkModes.includes(mode.id)}
                                            onChange={() => {}}
                                            className="text-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sekcja 4: Budżet */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Budżet</h2>
                            <p className="text-sm text-app-silver mb-4">Planowany zakres wynagrodzeń:</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {BUDGET_RANGES.map(range => (
                                <div
                                    key={range.id}
                                    onClick={() => handleBudgetRangeSelect(range.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedBudgetRange === range.id
                                            ? 'global--border-blue global--bg-light-blue'
                                            : 'global--border-d-white hover:global--border-silver'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <header>
                                            <h3 className="font-semibold text-app-dark">{range.label}</h3>
                                            {range.description && (
                                                <p className="text-sm text-app-silver">{range.description}</p>
                                            )}
                                        </header>
                                        <input
                                            type="radio"
                                            name="budgetRange"
                                            checked={selectedBudgetRange === range.id}
                                            onChange={() => {}}
                                            className="text-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sekcja 5: Lokalizacja */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Lokalizacja</h2>
                            <p className="text-sm text-app-silver mb-4">Preferowana lokalizacja współpracownika (opcjonalnie):</p>
                        </header>

                        <input
                            type="text"
                            value={location}
                            onChange={(e) => handleLocationChange(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="np. Warszawa, Kraków, cała Polska, bez znaczenia..."
                        />
                    </div>

                    {/* Sekcja 6: Dodatkowe uwagi */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Dodatkowe uwagi</h2>
                            <p className="text-sm text-app-silver mb-4">
                                Opisz szczegółowo czego szukasz lub dodaj inne ważne informacje (opcjonalnie):
                            </p>
                        </header>

                        <textarea
                            value={additionalNotes}
                            onChange={(e) => handleNotesChange(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                            rows={6}
                            placeholder="Opisz dokładniej swoje oczekiwania, specyficzne wymagania projektowe, kulturę pracy, którą chcesz budować w zespole..."
                        />
                        <div className="mt-2 text-xs text-app-silver">
                            {additionalNotes.length}/1000 znaków
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-app-silver">
                        {selectedWorkModes.length > 0 && (
                            <span>
                                Wybrano: {selectedWorkModes.length} tryb{selectedWorkModes.length > 1 ? 'y' : ''} pracy
                                {location && ', lokalizacja: ' + location}
                            </span>
                        )}
                    </div>

                    <Button
                        type="button"
                        uiType="primary"
                        size="regularSize"
                        onClick={handleSubmitToMicroservice}
                        disabled={!canProceed || isSearching}
                    >
                        {isSearching ? 'Generuję wyniki...' : 'Generuj wyniki'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SearchCreatorStage4;