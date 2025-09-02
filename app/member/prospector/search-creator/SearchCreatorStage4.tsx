import React, { useState } from "react";
import Button from "@/app/components/ui/Button";

interface SearchCreatorStage4Props {
    nextStage: () => void;
    updateFormData: (data: any) => void;
    formData: any;
}

interface ExperienceLevel {
    id: string;
    title: string;
    description: string;
}

interface Industry {
    id: string;
    title: string;
    description: string;
}

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
    {
        id: 'junior',
        title: 'Junior (0-2 lata)',
        description: 'Początkujący, szuka mentorów i wsparcia'
    },
    {
        id: 'mid',
        title: 'Mid (2-5 lat)',
        description: 'Średnie doświadczenie, pewność w podstawach'
    },
    {
        id: 'senior',
        title: 'Senior (5-10 lat)',
        description: 'Doświadczony, może mentorować innych'
    },
    {
        id: 'expert',
        title: 'Expert (10+ lat)',
        description: 'Ekspert w dziedzinie, lider projektów'
    },
    {
        id: 'any',
        title: 'Dowolny poziom',
        description: 'Otwartość na każdy poziom doświadczenia'
    }
];

const INDUSTRIES: Industry[] = [
    {
        id: 'technology',
        title: 'Technologia i IT',
        description: 'Programowanie, cyberbezpieczeństwo, AI'
    },
    {
        id: 'finance',
        title: 'Finanse i Księgowość',
        description: 'Bankowość, inwestycje, rachunkowość'
    },
    {
        id: 'marketing',
        title: 'Marketing i Reklama',
        description: 'Digital marketing, social media, PR'
    },
    {
        id: 'sales',
        title: 'Sprzedaż',
        description: 'B2B, B2C, e-commerce, CRM'
    },
    {
        id: 'design',
        title: 'Design i Kreatywność',
        description: 'UX/UI, grafika, branding'
    },
    {
        id: 'management',
        title: 'Zarządzanie',
        description: 'Project management, HR, operations'
    },
    {
        id: 'consulting',
        title: 'Konsulting',
        description: 'Doradztwo biznesowe, strategia'
    },
    {
        id: 'education',
        title: 'Edukacja',
        description: 'Szkolenia, e-learning, kursy'
    },
    {
        id: 'healthcare',
        title: 'Zdrowie',
        description: 'Medycyna, farmacja, wellness'
    },
    {
        id: 'other',
        title: 'Inne branże',
        description: 'Przemysł, usługi, nieruchomości'
    }
];

const SearchCreatorStage4: React.FC<SearchCreatorStage4Props> = ({
                                                                     nextStage,
                                                                     updateFormData,
                                                                     formData
                                                                 }) => {
    const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<string>(
        formData.experienceLevel || ''
    );
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
        formData.industries || []
    );
    const [requiredSkills, setRequiredSkills] = useState<string[]>(
        formData.requiredSkills || []
    );
    const [languages, setLanguages] = useState<string[]>(
        formData.languages || []
    );
    const [newSkill, setNewSkill] = useState('');
    const [newLanguage, setNewLanguage] = useState('');

    const handleExperienceLevelSelect = (levelId: string) => {
        setSelectedExperienceLevel(levelId);
        updateFormData({ experienceLevel: levelId });
    };

    const toggleIndustry = (industryId: string) => {
        const newIndustries = selectedIndustries.includes(industryId)
            ? selectedIndustries.filter(i => i !== industryId)
            : [...selectedIndustries, industryId];

        setSelectedIndustries(newIndustries);
        updateFormData({ industries: newIndustries });
    };

    const addSkill = () => {
        if (newSkill.trim() && !requiredSkills.includes(newSkill.trim())) {
            const updatedSkills = [...requiredSkills, newSkill.trim()];
            setRequiredSkills(updatedSkills);
            updateFormData({ requiredSkills: updatedSkills });
            setNewSkill('');
        }
    };

    const removeSkill = (index: number) => {
        const updatedSkills = requiredSkills.filter((_, i) => i !== index);
        setRequiredSkills(updatedSkills);
        updateFormData({ requiredSkills: updatedSkills });
    };

    const addLanguage = () => {
        if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
            const updatedLanguages = [...languages, newLanguage.trim()];
            setLanguages(updatedLanguages);
            updateFormData({ languages: updatedLanguages });
            setNewLanguage('');
        }
    };

    const removeLanguage = (index: number) => {
        const updatedLanguages = languages.filter((_, i) => i !== index);
        setLanguages(updatedLanguages);
        updateFormData({ languages: updatedLanguages });
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            action();
        }
    };

    const canProceed = selectedExperienceLevel && selectedIndustries.length > 0;

    return (
        <div className="max-w-5xl min-h-[90vh] max-h-[90vh] m-auto flex flex-col py-10 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col justify-between flex-1 global--border-d-white rounded-md p-10">
                <header>
                    <h1 className="text-2xl font-bold text-app-dark mb-4">Kompetencje i doświadczenie</h1>
                    <p className="text-base font-regular text-app-silver leading-[30px]">
                        Określ jakiego poziomu doświadczenia i umiejętności szukasz u współpracowników.
                    </p>
                </header>

                <div className="flex-1">
                    {/* Sekcja 1: Poziom doświadczenia */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Oczekiwany poziom doświadczenia</h2>
                            <p className="text-sm text-app-silver mb-4">Jaki poziom doświadczenia powinni mieć współpracownicy:</p>
                        </header>

                        <div className="grid grid-cols-1 gap-3">
                            {EXPERIENCE_LEVELS.map(level => (
                                <div
                                    key={level.id}
                                    onClick={() => handleExperienceLevelSelect(level.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedExperienceLevel === level.id
                                            ? 'global--border-blue global--bg-light-blue'
                                            : 'global--border-d-white hover:global--border-silver'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <header>
                                            <h3 className="font-semibold text-app-dark">{level.title}</h3>
                                            <p className="text-sm text-app-silver">{level.description}</p>
                                        </header>
                                        <input
                                            type="radio"
                                            name="experienceLevel"
                                            checked={selectedExperienceLevel === level.id}
                                            onChange={() => {}}
                                            className="text-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sekcja 2: Branże */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Interesujące branże</h2>
                            <p className="text-sm text-app-silver mb-4">Wybierz branże w których szukasz współpracowników:</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {INDUSTRIES.map(industry => (
                                <div
                                    key={industry.id}
                                    onClick={() => toggleIndustry(industry.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedIndustries.includes(industry.id)
                                            ? 'global--border-blue global--bg-light-blue'
                                            : 'global--border-d-white hover:global--border-silver'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <header>
                                            <h3 className="font-semibold text-app-dark">{industry.title}</h3>
                                            <p className="text-sm text-app-silver">{industry.description}</p>
                                        </header>
                                        <input
                                            type="checkbox"
                                            checked={selectedIndustries.includes(industry.id)}
                                            onChange={() => {}}
                                            className="text-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sekcja 3: Wymagane umiejętności */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Pożądane umiejętności</h2>
                            <p className="text-sm text-app-silver mb-4">Dodaj umiejętności, które będą przydatne w współpracy:</p>
                        </header>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, addSkill)}
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="np. React, Python, SEO, Photoshop..."
                            />
                            <button
                                onClick={addSkill}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Dodaj
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {requiredSkills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                                >
                                    {skill}
                                    <button
                                        onClick={() => removeSkill(index)}
                                        className="text-blue-500 hover:text-blue-700 ml-1"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Sekcja 4: Języki */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Języki komunikacji</h2>
                            <p className="text-sm text-app-silver mb-4">Jakie języki powinni znać współpracownicy:</p>
                        </header>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newLanguage}
                                onChange={(e) => setNewLanguage(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, addLanguage)}
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="np. Angielski B2, Niemiecki, Hiszpański..."
                            />
                            <button
                                onClick={addLanguage}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Dodaj
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {languages.map((language, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2"
                                >
                                    {language}
                                    <button
                                        onClick={() => removeLanguage(index)}
                                        className="text-green-500 hover:text-green-700 ml-1"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
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

export default SearchCreatorStage4;