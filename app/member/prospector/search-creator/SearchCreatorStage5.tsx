import React, { useState } from "react";
import Button from "@/app/components/ui/Button";

interface SearchCreatorStage5Props {
    nextStage: () => void;
    updateFormData: (data: any) => void;
    formData: any;
}

interface ProjectType {
    id: string;
    title: string;
    description: string;
}

interface TimeCommitment {
    id: string;
    title: string;
    description: string;
}

interface WorkMode {
    id: string;
    title: string;
    description: string;
}

interface BudgetRange {
    id: string;
    title: string;
    description: string;
}

const PROJECT_TYPES: ProjectType[] = [
    {
        id: 'long-term',
        title: 'Długoterminowa współpraca',
        description: '6+ miesięcy stałej współpracy'
    },
    {
        id: 'short-term',
        title: 'Projekt krótkoterminowy',
        description: '1-6 miesięcy pracy nad konkretnym projektem'
    },
    {
        id: 'one-time',
        title: 'Jednorazowe zlecenie',
        description: 'Konkretne zadanie do wykonania'
    },
    {
        id: 'startup',
        title: 'Współpraca przy startupu',
        description: 'Budowanie nowego biznesu od podstaw'
    },
    {
        id: 'consulting',
        title: 'Freelancing/konsulting',
        description: 'Doradztwo i wsparcie w konkretnych obszarach'
    }
];

const TIME_COMMITMENTS: TimeCommitment[] = [
    {
        id: 'full-time',
        title: 'Pełny etat (40h/tydzień)',
        description: 'Pełne zaangażowanie czasowe'
    },
    {
        id: 'part-time',
        title: 'Część etatu (20-30h/tydzień)',
        description: 'Znaczące ale niepełne zaangażowanie'
    },
    {
        id: 'project-based',
        title: 'Projektowo (10-20h/tydzień)',
        description: 'Praca nad konkretnymi zadaniami'
    },
    {
        id: 'consultations',
        title: 'Konsultacje (5-10h/tydzień)',
        description: 'Okresowe wsparcie i doradztwo'
    },
    {
        id: 'flexible',
        title: 'Elastycznie',
        description: 'W zależności od potrzeb projektu'
    }
];

const WORK_MODES: WorkMode[] = [
    {
        id: 'remote',
        title: 'Zdalnie',
        description: 'Praca wyłącznie online'
    },
    {
        id: 'hybrid',
        title: 'Hybrydowo',
        description: 'Kombinacja pracy zdalnej i stacjonarnej'
    },
    {
        id: 'onsite',
        title: 'Stacjonarnie',
        description: 'Praca w biurze/na miejscu'
    },
    {
        id: 'flexible',
        title: 'Elastycznie',
        description: 'Dostosowanie do potrzeb'
    }
];

const BUDGET_RANGES: BudgetRange[] = [
    {
        id: 'up-to-50',
        title: 'Do 50 zł/h',
        description: 'Budżet podstawowy'
    },
    {
        id: '50-100',
        title: '50-100 zł/h',
        description: 'Budżet średni'
    },
    {
        id: '100-200',
        title: '100-200 zł/h',
        description: 'Budżet podwyższony'
    },
    {
        id: '200-plus',
        title: '200+ zł/h',
        description: 'Budżet premium'
    },
    {
        id: 'negotiable',
        title: 'Do uzgodnienia',
        description: 'Elastyczne podejście do wynagrodzeń'
    }
];

const SearchCreatorStage5: React.FC<SearchCreatorStage5Props> = ({
                                                                     nextStage,
                                                                     updateFormData,
                                                                     formData
                                                                 }) => {
    const [selectedProjectType, setSelectedProjectType] = useState<string>(
        formData.projectType || ''
    );
    const [selectedTimeCommitment, setSelectedTimeCommitment] = useState<string>(
        formData.timeCommitment || ''
    );
    const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>(
        formData.workModes || []
    );
    const [selectedBudgetRange, setSelectedBudgetRange] = useState<string>(
        formData.budgetRange || ''
    );
    const [location, setLocation] = useState<string>(
        formData.location || ''
    );

    const handleProjectTypeSelect = (typeId: string) => {
        setSelectedProjectType(typeId);
        updateFormData({ projectType: typeId });
    };

    const handleTimeCommitmentSelect = (commitmentId: string) => {
        setSelectedTimeCommitment(commitmentId);
        updateFormData({ timeCommitment: commitmentId });
    };

    const toggleWorkMode = (modeId: string) => {
        const newModes = selectedWorkModes.includes(modeId)
            ? selectedWorkModes.filter(m => m !== modeId)
            : [...selectedWorkModes, modeId];

        setSelectedWorkModes(newModes);
        updateFormData({ workModes: newModes });
    };

    const handleBudgetRangeSelect = (rangeId: string) => {
        setSelectedBudgetRange(rangeId);
        updateFormData({ budgetRange: rangeId });
    };

    const handleLocationChange = (value: string) => {
        setLocation(value);
        updateFormData({ location: value });
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
                                            <h3 className="font-semibold text-app-dark">{type.title}</h3>
                                            <p className="text-sm text-app-silver">{type.description}</p>
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
                                            <h3 className="font-semibold text-app-dark">{commitment.title}</h3>
                                            <p className="text-sm text-app-silver">{commitment.description}</p>
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
                                            <h3 className="font-semibold text-app-dark">{mode.title}</h3>
                                            <p className="text-sm text-app-silver">{mode.description}</p>
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
                                            <h3 className="font-semibold text-app-dark">{range.title}</h3>
                                            <p className="text-sm text-app-silver">{range.description}</p>
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
                </div>

                <div className="flex justify-end items-center mt-6">
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

export default SearchCreatorStage5;