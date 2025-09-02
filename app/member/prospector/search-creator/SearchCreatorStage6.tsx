import React, { useState } from "react";
import Button from "@/app/components/ui/Button";

interface SearchCreatorStage6Props {
    nextStage: () => void;
    updateFormData: (data: any) => void;
    formData: any;
}

interface Priority {
    id: string;
    title: string;
    description: string;
}

interface PersonalityTrait {
    id: string;
    title: string;
    description: string;
}

const PRIORITIES: Priority[] = [
    {
        id: 'technical-skills',
        title: 'Umiejętności techniczne',
        description: 'Wysokie kompetencje w wybranej dziedzinie'
    },
    {
        id: 'experience',
        title: 'Doświadczenie praktyczne',
        description: 'Wcześniejsza praca w podobnych projektach'
    },
    {
        id: 'communication',
        title: 'Umiejętności komunikacyjne',
        description: 'Płynna komunikacja i współpraca w zespole'
    },
    {
        id: 'creativity',
        title: 'Kreatywność',
        description: 'Innowacyjne podejście do rozwiązywania problemów'
    },
    {
        id: 'reliability',
        title: 'Niezawodność',
        description: 'Terminowość i odpowiedzialność za zadania'
    },
    {
        id: 'leadership',
        title: 'Umiejętności przywódcze',
        description: 'Zdolność do kierowania i motywowania zespołu'
    },
    {
        id: 'adaptability',
        title: 'Elastyczność',
        description: 'Szybka adaptacja do zmian i nowych wyzwań'
    },
    {
        id: 'networking',
        title: 'Sieć kontaktów',
        description: 'Dostęp do branżowych kontaktów i partnerów'
    }
];

const PERSONALITY_TRAITS: PersonalityTrait[] = [
    {
        id: 'proactive',
        title: 'Proaktywny',
        description: 'Samodzielnie podejmuje inicjatywy'
    },
    {
        id: 'analytical',
        title: 'Analityczny',
        description: 'Systematyczne podejście do problemów'
    },
    {
        id: 'collaborative',
        title: 'Zespołowy',
        description: 'Naturalnie współpracuje z innymi'
    },
    {
        id: 'detail-oriented',
        title: 'Skrupulatny',
        description: 'Dbałość o szczegóły i jakość'
    },
    {
        id: 'ambitious',
        title: 'Ambitny',
        description: 'Dąży do wysokich celów i rozwoju'
    },
    {
        id: 'patient',
        title: 'Cierpliwy',
        description: 'Spokojne podejście do długoterminowych celów'
    },
    {
        id: 'energetic',
        title: 'Energiczny',
        description: 'Wysokie tempo pracy i motywacja'
    },
    {
        id: 'diplomatic',
        title: 'Dyplomatyczny',
        description: 'Umiejętność rozwiązywania konfliktów'
    }
];

const SearchCreatorStage6: React.FC<SearchCreatorStage6Props> = ({
                                                                     nextStage,
                                                                     updateFormData,
                                                                     formData
                                                                 }) => {
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>(
        formData.priorities || []
    );
    const [selectedPersonalityTraits, setSelectedPersonalityTraits] = useState<string[]>(
        formData.personalityTraits || []
    );
    const [specificRequirements, setSpecificRequirements] = useState<string[]>(
        formData.specificRequirements || []
    );
    const [dealBreakers, setDealBreakers] = useState<string[]>(
        formData.dealBreakers || []
    );
    const [additionalNotes, setAdditionalNotes] = useState<string>(
        formData.additionalNotes || ''
    );

    const [newRequirement, setNewRequirement] = useState('');
    const [newDealBreaker, setNewDealBreaker] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const togglePriority = (priorityId: string) => {
        const newPriorities = selectedPriorities.includes(priorityId)
            ? selectedPriorities.filter(p => p !== priorityId)
            : [...selectedPriorities, priorityId];

        setSelectedPriorities(newPriorities);
        updateFormData({ priorities: newPriorities });
    };

    const togglePersonalityTrait = (traitId: string) => {
        const newTraits = selectedPersonalityTraits.includes(traitId)
            ? selectedPersonalityTraits.filter(t => t !== traitId)
            : [...selectedPersonalityTraits, traitId];

        setSelectedPersonalityTraits(newTraits);
        updateFormData({ personalityTraits: newTraits });
    };

    const addSpecificRequirement = () => {
        if (newRequirement.trim() && !specificRequirements.includes(newRequirement.trim())) {
            const updatedRequirements = [...specificRequirements, newRequirement.trim()];
            setSpecificRequirements(updatedRequirements);
            updateFormData({ specificRequirements: updatedRequirements });
            setNewRequirement('');
        }
    };

    const removeSpecificRequirement = (index: number) => {
        const updatedRequirements = specificRequirements.filter((_, i) => i !== index);
        setSpecificRequirements(updatedRequirements);
        updateFormData({ specificRequirements: updatedRequirements });
    };

    const addDealBreaker = () => {
        if (newDealBreaker.trim() && !dealBreakers.includes(newDealBreaker.trim())) {
            const updatedDealBreakers = [...dealBreakers, newDealBreaker.trim()];
            setDealBreakers(updatedDealBreakers);
            updateFormData({ dealBreakers: updatedDealBreakers });
            setNewDealBreaker('');
        }
    };

    const removeDealBreaker = (index: number) => {
        const updatedDealBreakers = dealBreakers.filter((_, i) => i !== index);
        setDealBreakers(updatedDealBreakers);
        updateFormData({ dealBreakers: updatedDealBreakers });
    };

    const handleNotesChange = (value: string) => {
        setAdditionalNotes(value);
        updateFormData({ additionalNotes: value });
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            action();
        }
    };

    const handleSubmitToMicroservice = async () => {
        if (!canProceed) return;

        setIsSearching(true);

        try {
            // Przygotuj dane do wysłania
            const searchCriteria = {
                timestamp: new Date().toISOString(),
                collaboration_areas: formData.collaborationAreas,  // snake_case
                meeting_frequency: formData.meetingFrequency,      // snake_case
                session_length: formData.sessionLength,            // snake_case
                time_preferences: formData.timePreferences,        // snake_case
                work_styles: formData.workStyles,                  // snake_case
                experience_level: formData.experienceLevel,        // snake_case
                industries: formData.industries,
                required_skills: formData.requiredSkills,          // snake_case
                languages: formData.languages,
                project_type: formData.projectType,                // snake_case
                time_commitment: formData.timeCommitment,          // snake_case
                work_modes: formData.workModes,                    // snake_case
                budget_range: formData.budgetRange,                // snake_case
                location: formData.location,
                priorities: selectedPriorities,
                personality_traits: selectedPersonalityTraits,     // snake_case
                specific_requirements: specificRequirements,       // snake_case
                deal_breakers: dealBreakers,                       // snake_case
                additional_notes: additionalNotes                  // snake_case
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
                sessionStorage.setItem('searchId', result.search_id);
                sessionStorage.setItem('searchCriteria', JSON.stringify(searchCriteria));

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

            alert(errorMessage + ' Spróbuj ponownie.');
        } finally {
            setIsSearching(false);
        }
    };

    const canProceed = selectedPriorities.length > 0;

    return (
        <div className="max-w-5xl min-h-[90vh] max-h-[90vh] m-auto flex flex-col py-10 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col justify-between flex-1 global--border-d-white rounded-md p-10">
                <header>
                    <h1 className="text-2xl font-bold text-app-dark mb-4">Dopasowanie i oczekiwania</h1>
                    <p className="text-base font-regular text-app-silver leading-[30px]">
                        Określ najważniejsze cechy i wymagania wobec idealnego współpracownika.
                    </p>
                </header>

                <div className="flex-1">
                    {/* Sekcja 1: Priorytety */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Najważniejsze priorytety</h2>
                            <p className="text-sm text-app-silver mb-4">
                                Wybierz maksymalnie 4 najważniejsze cechy współpracownika:
                            </p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {PRIORITIES.map(priority => (
                                <div
                                    key={priority.id}
                                    onClick={() => togglePriority(priority.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedPriorities.includes(priority.id)
                                            ? 'global--border-blue global--bg-light-blue'
                                            : selectedPriorities.length >= 4
                                                ? 'global--border-d-white opacity-50 cursor-not-allowed'
                                                : 'global--border-d-white hover:global--border-silver'
                                    }`}
                                    style={{
                                        pointerEvents:
                                            selectedPriorities.includes(priority.id) || selectedPriorities.length < 4
                                                ? 'auto'
                                                : 'none'
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <header>
                                            <h3 className="font-semibold text-app-dark">{priority.title}</h3>
                                            <p className="text-sm text-app-silver">{priority.description}</p>
                                        </header>
                                        <input
                                            type="checkbox"
                                            checked={selectedPriorities.includes(priority.id)}
                                            onChange={() => {}}
                                            className="text-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedPriorities.length > 0 && (
                            <div className="mt-4 text-sm text-app-silver">
                                Wybrano: {selectedPriorities.length}/4 priorytetów
                            </div>
                        )}
                    </div>

                    {/* Sekcja 2: Cechy osobowości */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Preferowane cechy osobowości</h2>
                            <p className="text-sm text-app-silver mb-4">
                                Jakie cechy charakteru są dla Ciebie ważne:
                            </p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {PERSONALITY_TRAITS.map(trait => (
                                <div
                                    key={trait.id}
                                    onClick={() => togglePersonalityTrait(trait.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedPersonalityTraits.includes(trait.id)
                                            ? 'global--border-blue global--bg-light-blue'
                                            : 'global--border-d-white hover:global--border-silver'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <header>
                                            <h3 className="font-semibold text-app-dark">{trait.title}</h3>
                                            <p className="text-sm text-app-silver">{trait.description}</p>
                                        </header>
                                        <input
                                            type="checkbox"
                                            checked={selectedPersonalityTraits.includes(trait.id)}
                                            onChange={() => {}}
                                            className="text-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sekcja 3: Specyficzne wymagania */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Specyficzne wymagania</h2>
                            <p className="text-sm text-app-silver mb-4">
                                Dodaj konkretne wymagania dotyczące współpracownika:
                            </p>
                        </header>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newRequirement}
                                onChange={(e) => setNewRequirement(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, addSpecificRequirement)}
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="np. Minimum 3 lata doświadczenia w React, Certyfikat Google Ads..."
                            />
                            <button
                                onClick={addSpecificRequirement}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Dodaj
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {specificRequirements.map((requirement, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                                >
                                    {requirement}
                                    <button
                                        onClick={() => removeSpecificRequirement(index)}
                                        className="text-blue-500 hover:text-blue-700 ml-1"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Sekcja 4: Deal breakers */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Wykluczające czynniki</h2>
                            <p className="text-sm text-app-silver mb-4">
                                Co absolutnie wykluczyłoby współpracę:
                            </p>
                        </header>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newDealBreaker}
                                onChange={(e) => setNewDealBreaker(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, addDealBreaker)}
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="np. Brak dostępności w weekendy, Brak znajomości języka angielskiego..."
                            />
                            <button
                                onClick={addDealBreaker}
                                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Dodaj
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {dealBreakers.map((dealBreaker, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-2"
                                >
                                    {dealBreaker}
                                    <button
                                        onClick={() => removeDealBreaker(index)}
                                        className="text-red-500 hover:text-red-700 ml-1"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Sekcja 5: Dodatkowe uwagi */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Dodatkowe uwagi</h2>
                            <p className="text-sm text-app-silver mb-4">
                                Opisz szczegółowo czego szukasz lub dodaj inne ważne informacje:
                            </p>
                        </header>

                        <textarea
                            value={additionalNotes}
                            onChange={(e) => handleNotesChange(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                            rows={6}
                            placeholder="Opisz dokładniej swoje oczekiwania, specyficzne wymagania projektowe, kulturę pracy, którą chcesz budować w zespole..."
                        />
                    </div>
                </div>

                <div className="flex justify-end items-center mt-6">
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

export default SearchCreatorStage6;