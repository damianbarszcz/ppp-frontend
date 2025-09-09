import React, { useState } from "react";
import Button from "@/app/components/ui/Button";
import { EXPERIENCE_LEVELS, INDUSTRIES } from "@/app/constans/profileContans";

interface SearchCreatorStage4Props {
    nextStage: () => void;
    updateFormData: (data: any) => void;
    formData: any;
}

const SearchCreatorStage4: React.FC<SearchCreatorStage4Props> = ({
    nextStage,
    updateFormData,
    formData
}) => {
    const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<string>(
        formData.experience_level || ''
    );
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
        formData.industries || []
    );
    const [requiredSkills, setRequiredSkills] = useState<string[]>(
        formData.required_skills || []
    );
    const [newSkill, setNewSkill] = useState('');

    const handleExperienceLevelSelect = (levelId: string) => {
        setSelectedExperienceLevel(levelId);
        updateFormData({ experience_level: levelId });
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
            updateFormData({ required_skills: updatedSkills });
            setNewSkill('');
        }
    };

    const removeSkill = (index: number) => {
        const updatedSkills = requiredSkills.filter((_, i) => i !== index);
        setRequiredSkills(updatedSkills);
        updateFormData({ required_skills: updatedSkills });
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
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
                                            <h3 className="font-semibold text-app-dark">{level.label}</h3>
                                            {level.description && (
                                                <p className="text-sm text-app-silver">{level.description}</p>
                                            )}
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
                                            <h3 className="font-semibold text-app-dark">{industry.label}</h3>
                                            {industry.description && (
                                                <p className="text-sm text-app-silver">{industry.description}</p>
                                            )}
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
                            <p className="text-sm text-app-silver mb-4">Dodaj umiejętności, które będą przydatne w współpracy (opcjonalnie):</p>
                        </header>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="np. React, Python, SEO, Photoshop..."
                            />
                            <button
                                onClick={addSkill}
                                disabled={!newSkill.trim()}
                                className={`px-6 py-3 rounded-lg transition-colors ${
                                    newSkill.trim()
                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Dodaj
                            </button>
                        </div>

                        {requiredSkills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {requiredSkills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                                    >
                                        {skill}
                                        <button
                                            onClick={() => removeSkill(index)}
                                            className="text-blue-500 hover:text-blue-700 ml-1 font-bold"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {requiredSkills.length === 0 && (
                            <p className="text-sm text-app-silver italic">
                                Nie dodano jeszcze żadnych umiejętności. To pole jest opcjonalne.
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end items-center mt-6">
                    <Button type="button" uiType="primary" size="regularSize" onClick={nextStage} disabled={!canProceed}>
                        Dalej
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SearchCreatorStage4;