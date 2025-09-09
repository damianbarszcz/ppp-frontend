import React, { useState } from "react";
import Textarea from "@/app/components/ui/Textarea";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import InputCheckbox from "@/app/components/ui/InputCheckbox";
import InputRadio from "@/app/components/ui/InputRadio";
import ProfileCreatorFormSelection from "./ProfileCreatorFormSelection";
import ProfileCreatorFormSkillInput from "./ProfileCreatorFormSkillInput";
import { ProspectorProfileFormProps } from '@/app/types/profile.types';
import {
    COLLABORATION_AREAS,
    EXPERIENCE_LEVELS,
    INDUSTRIES,
    WORK_MODES,
    BUDGET_RANGES,
    PROJECT_TYPES,
    TIME_COMMITMENTS
} from '@/app/constans/profileContans';

const ProfileCreatorForm: React.FC<ProspectorProfileFormProps> = ({
    formData,
    updateFormData,
    publishProspectorProfile,
    validationErrors
}) => {
    const [activeSection, setActiveSection] = useState<string>('basic');

    const handleArrayToggle = (field: keyof typeof formData, value: string) => {
        const currentArray = (formData[field] as string[]) || [];
        const newArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value];
        updateFormData({ [field]: newArray });
    };

    const handleSkillAdd = (value: string) => {
        if (value.trim() && !formData.requiredSkills?.includes(value.trim())) {
            updateFormData({
                requiredSkills: [...(formData.requiredSkills || []), value.trim()]
            });
        }
    };

    const handleSkillRemove = (index: number) => {
        const newSkills = formData.requiredSkills?.filter((_, i) => i !== index) || [];
        updateFormData({ requiredSkills: newSkills });
    };

    return (
        <section className="max-w-6xl mx-auto py-10 px-4">
            <div className="global--border-d-white rounded-md p-10">
                <header className="mb-10">
                    <h1 className="text-2xl font-bold mb-4 text-app-dark">Twój profil współpracownika</h1>
                    <p className="text-base font-regular text-app-silver">
                        Wypełnij szczegółowe informacje, aby potencjalni partnerzy mogli Cię łatwiej znaleźć i ocenić dopasowanie.
                    </p>
                </header>

                <ProfileCreatorFormSelection activeSection={activeSection} setActiveSection={setActiveSection} />

                <form onSubmit={publishProspectorProfile}>
                    {/* SEKCJA: PODSTAWOWE */}
                    {activeSection === 'basic' && (
                        <div className="space-y-8">
                            <div>
                                <Textarea
                                    isLabel={true}
                                    labelCaption="O mnie *"
                                    name="about-me"
                                    type="text"
                                    placeholder="Opisz swoje doświadczenie, pasje i cele zawodowe..."
                                    uiType="light"
                                    value={formData.aboutMe}
                                    onChange={(e) => updateFormData({ aboutMe: e.target.value })}
                                    validateError={validationErrors.aboutMeError}
                                    rows={8}
                                />
                            </div>

                            <div className="pt-2 grid gap-3.5 grid-cols-2">
                                <div>
                                    <Input
                                        isLabel={true}
                                        labelCaption="Specjalizacja/Tytuł zawodowy *"
                                        name="specialization"
                                        type="text"
                                        placeholder="np. Senior React Developer, Product Manager"
                                        uiType="light"
                                        value={formData.specialization ?? ''}
                                        onChange={(e) => updateFormData({ specialization: e.target.value })}
                                        validateError={validationErrors.specializationError}
                                    />
                                </div>

                                <div>
                                    <Input
                                        isLabel={true}
                                        labelCaption="Lokalizacja"
                                        name="location"
                                        type="text"
                                        placeholder="Warszawa, Kraków, cała Polska..."
                                        uiType="light"
                                        value={formData.location || ''}
                                        onChange={(e) => updateFormData({ location: e.target.value })}
                                        validateError=""
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SEKCJA: WSPÓŁPRACA */}
                    {activeSection === 'collaboration' && (
                        <div className="space-y-8">
                            <div>
                                <label className="text-base font-medium text-app-dark mb-2 block">Obszary współpracy <span className="text-app-red">*</span></label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {COLLABORATION_AREAS.map(area => (
                                        <InputCheckbox
                                            key={area.id}
                                            id={area.id}
                                            label={area.label}
                                            isSelected={formData.collaborationAreas?.includes(area.id) || false}
                                            onToggle={(id) => handleArrayToggle('collaborationAreas', id)}
                                            type="checkbox"
                                            uiType="light"
                                        />
                                    ))}
                                </div>

                                {validationErrors.collaborationAreasError && (
                                    <p className="text-app-red text-sm mt-3">{validationErrors.collaborationAreasError}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-base font-medium text-app-dark mb-2 block">Tryby pracy <span className="text-app-red">*</span></label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {WORK_MODES.map(mode => (
                                        <InputCheckbox
                                            key={mode.id}
                                            id={mode.id}
                                            label={mode.label}
                                            isSelected={formData.workModes?.includes(mode.id) || false}
                                            onToggle={(id) => handleArrayToggle('workModes', id)}
                                            type="checkbox"
                                            uiType="light"
                                        />
                                    ))}
                                </div>
                                {validationErrors.workModesError && (
                                    <p className="text-app-red text-sm mt-3">{validationErrors.workModesError}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SEKCJA: DOŚWIADCZENIE */}
                    {activeSection === 'experience' && (
                        <div className="space-y-8">
                            <div>
                                <label className="text-base font-medium text-app-dark mb-2 block">Poziom doświadczenia <span className="text-app-red">*</span></label>
                                <div className="grid grid-cols-1 gap-3">
                                    {EXPERIENCE_LEVELS.map(level => (
                                        <InputRadio
                                            key={level.id}
                                            id={level.id}
                                            label={level.label}
                                            isSelected={formData.experienceLevel === level.id}
                                            onSelect={(id) => updateFormData({ experienceLevel: id })}
                                            name="experienceLevel"
                                            uiType="light"
                                            required={true}
                                        />
                                    ))}
                                </div>
                                {validationErrors.experienceLevelError && (
                                    <p className="text-app-red text-sm mt-3">{validationErrors.experienceLevelError}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-base font-medium text-app-dark mb-2 block">Branże <span className="text-app-red">*</span></label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {INDUSTRIES.map(industry => (
                                        <InputCheckbox
                                            key={industry.id}
                                            id={industry.id}
                                            label={industry.label}
                                            isSelected={formData.industries?.includes(industry.id) || false}
                                            onToggle={(id) => handleArrayToggle('industries', id)}
                                            type="checkbox"
                                            uiType="light"
                                        />
                                    ))}
                                </div>
                                {validationErrors.industriesError && (
                                    <p className="text-app-red text-sm mt-3">{validationErrors.industriesError}</p>
                                )}
                            </div>

                            <div>
                                <ProfileCreatorFormSkillInput
                                    skills={formData.requiredSkills || []}
                                    onAdd={handleSkillAdd}
                                    onRemove={handleSkillRemove}
                                    placeholder="Dodaj umiejętność..."
                                />
                            </div>
                        </div>
                    )}

                    {/* SEKCJA: Format pracy */}
                    {activeSection === 'format' && (
                        <div className="space-y-8">
                            <div>
                                <label className="text-base font-medium text-app-dark mb-2 block">Typ projektu <span className="text-app-red">*</span></label>
                                <div className="grid grid-cols-1 gap-3">
                                    {PROJECT_TYPES.map(type => (
                                        <InputRadio
                                            key={type.id}
                                            id={type.id}
                                            label={type.label}
                                            isSelected={formData.projectType === type.id}
                                            onSelect={(id) => updateFormData({ projectType: id })}
                                            name="projectType"
                                            uiType="light"
                                            required={true}
                                        />
                                    ))}
                                </div>
                                {validationErrors.projectTypeError && (
                                    <p className="text-app-red text-sm mt-3">{validationErrors.projectTypeError}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-base font-medium text-app-dark mb-2 block">Zaangażowanie czasowe <span className="text-app-red">*</span></label>
                                <div className="grid grid-cols-1 gap-3">
                                    {TIME_COMMITMENTS.map(commitment => (
                                        <InputRadio
                                            key={commitment.id}
                                            id={commitment.id}
                                            label={commitment.label}
                                            isSelected={formData.timeCommitment === commitment.id}
                                            onSelect={(id) => updateFormData({ timeCommitment: id })}
                                            name="timeCommitment"
                                            uiType="light"
                                            required={true}
                                        />
                                    ))}
                                </div>
                                {validationErrors.timeCommitmentError && (
                                    <p className="text-app-red text-sm mt-3">{validationErrors.timeCommitmentError}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-base font-medium text-app-dark mb-2 block">Zakres budżetowy</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {BUDGET_RANGES.map(range => (
                                        <InputRadio
                                            key={range.id}
                                            id={range.id}
                                            label={range.label}
                                            isSelected={formData.budgetRange === range.id}
                                            onSelect={(id) => updateFormData({ budgetRange: id })}
                                            name="budgetRange"
                                            uiType="light"
                                            required={true}
                                        />
                                    ))}
                                </div>
                                {validationErrors.budgetRangeError && (
                                    <p className="text-app-red text-sm mt-3">{validationErrors.budgetRangeError}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SEKCJA: PREFERENCJE */}
                    {activeSection === 'preferences' && (
                        <div className="space-y-8">
                            <div>
                                <label className="text-base font-medium text-app-dark mb-2 block">Status dostępności</label>
                                <select value={formData.availabilityStatus || 'active'}
                                    onChange={(e) => updateFormData({ availabilityStatus: e.target.value })}
                                    className="w-full p-3 border bg-app-white border-app-dark-white text-app-dark rounded-md
                                    focus:outline-none focus:border-blue-500">

                                    <option value="active">Aktywny</option>
                                    <option value="busy">Zajęty</option>
                                    <option value="inactive">Nieaktywny</option>
                                </select>
                            </div>

                            <div>
                                <Textarea
                                    isLabel={true}
                                    labelCaption="Dodatkowe uwagi"
                                    name="additional-notes"
                                    type="text"
                                    value={formData.additionalNotes}
                                    placeholder="Dodatkowe informacje o sobie, oczekiwaniach lub preferencjach..."
                                    uiType="light"
                                    onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
                                    validateError=""
                                    rows={4}
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-10">
                        <Button type="submit" uiType="primary" size="regularSize">Zapisz profil</Button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ProfileCreatorForm;