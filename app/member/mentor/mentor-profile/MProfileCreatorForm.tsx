import React, { useState } from "react";
import Textarea from "@/app/components/ui/Textarea";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import InputCheckbox from "@/app/components/ui/InputCheckbox";
import MProfileCreatorFormSelection from "./MProfileCreatorFormSelection";
import MProfileCreatorFormSkillInput from "./MProfileCreatorFormSkillInput";
import { MentorProfileFormProps } from '@/app/types';
import {
    INDUSTRIES
} from '@/app/constans/profileContans';

// Dedykowane opcje dla mentorów
const EXPERTISE_AREAS = [
    { id: 'product-development', label: 'Rozwój produktu/usługi' },
    { id: 'marketing-sales', label: 'Marketing i sprzedaż' },
    { id: 'technology', label: 'Technologia i rozwój' },
    { id: 'management', label: 'Zarządzanie i leadership' },
    { id: 'finance', label: 'Finanse i księgowość' },
    { id: 'design', label: 'Design i UX/UI' },
    { id: 'data-science', label: 'Data Science i analityka' },
    { id: 'business-strategy', label: 'Strategia biznesowa' },
    { id: 'startup', label: 'Budowanie startupów' },
    { id: 'career-development', label: 'Rozwój kariery' }
];

const TARGET_AUDIENCE = [
    { id: 'junior', label: 'Junior (0-2 lata doświadczenia)' },
    { id: 'mid', label: 'Mid (2-5 lat doświadczenia)' },
    { id: 'senior', label: 'Senior (5+ lat doświadczenia)' },
    { id: 'career-change', label: 'Osoby zmieniające karierę' },
    { id: 'students', label: 'Studenci i absolwenci' },
    { id: 'entrepreneurs', label: 'Przedsiębiorcy' }
];

const MENTORING_TOPICS = [
    { id: 'technical-skills', label: 'Umiejętności techniczne' },
    { id: 'soft-skills', label: 'Umiejętności miękkie' },
    { id: 'career-planning', label: 'Planowanie kariery' },
    { id: 'job-search', label: 'Poszukiwanie pracy' },
    { id: 'interview-prep', label: 'Przygotowanie do rozmów' },
    { id: 'leadership', label: 'Rozwój przywództwa' },
    { id: 'networking', label: 'Budowanie sieci kontaktów' },
    { id: 'work-life-balance', label: 'Work-life balance' },
    { id: 'team-management', label: 'Zarządzanie zespołem' },
    { id: 'project-management', label: 'Zarządzanie projektami' },
    { id: 'public-speaking', label: 'Wystąpienia publiczne' },
    { id: 'negotiation', label: 'Negocjacje' }
];

const MProfileCreatorForm: React.FC<MentorProfileFormProps> = ({
                                                                   formData,
                                                                   updateFormData,
                                                                   publishMentorProfile,
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
        if (value.trim() && !formData.skills?.includes(value.trim())) {
            updateFormData({
                skills: [...(formData.skills || []), value.trim()]
            });
        }
    };

    const handleSkillRemove = (index: number) => {
        const newSkills = formData.skills?.filter((_, i) => i !== index) || [];
        updateFormData({ skills: newSkills });
    };

    return (
        <section className="max-w-6xl mx-auto py-10 px-4">
            <div className="border border-app-dark-white rounded-md p-10">
                <header className="mb-10 max-w-[40rem]">
                    <h1 className="text-2xl font-bold mb-4 text-app-dark">Profil Mentora</h1>
                    <p className="text-base font-regular text-app-silver">
                        Profil mentora pozwala na dzielenie się wiedzą i doświadczeniem z innymi.
                        Na podstawie twojego profilu dopasowujemy Cię do osób poszukujących wsparcia w twoich obszarach ekspertyzy.
                    </p>
                </header>

                <MProfileCreatorFormSelection activeSection={activeSection} setActiveSection={setActiveSection} />

                <form onSubmit={publishMentorProfile}>
                    {/* SEKCJA: PODSTAWOWE */}
                    {activeSection === 'basic' && (
                        <div className="space-y-8">
                            <div>
                                <Textarea
                                    isLabel={true}
                                    labelCaption="O mnie *"
                                    name="about-me"
                                    type="text"
                                    placeholder="Opisz swoje doświadczenie, pasje i podejście do mentoringu..."
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
                                        labelCaption="Lata doświadczenia *"
                                        name="years-of-experience"
                                        type="number"
                                        placeholder="np. 5"
                                        uiType="light"
                                        value={formData.yearsOfExperience.toString()}
                                        onChange={(e) => updateFormData({ yearsOfExperience: parseInt(e.target.value) || 0 })}
                                        validateError={validationErrors.yearsOfExperienceError}
                                    />
                                </div>
                            </div>

                            <div className="pt-2 grid gap-3.5 grid-cols-2">
                                <div>
                                    <Input
                                        isLabel={true}
                                        labelCaption="Aktualne stanowisko"
                                        name="current-position"
                                        type="text"
                                        placeholder="np. Senior Software Engineer w Google"
                                        uiType="light"
                                        value={formData.currentPosition || ''}
                                        onChange={(e) => updateFormData({ currentPosition: e.target.value })}
                                        validateError={validationErrors.currentPositionError}
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
                                        validateError={validationErrors.locationError}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SEKCJA: EKSPERTYZA */}
                    {activeSection === 'collaboration' && (
                        <div className="space-y-8">
                            <div>
                                <label className="text-base font-medium text-app-dark mb-2 block">Obszary ekspertyzy <span className="text-app-red">*</span></label>
                                <p className="text-sm text-app-silver mb-4">Wybierz obszary w których posiadasz wiedzę i doświadczenie:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {EXPERTISE_AREAS.map(area => (
                                        <InputCheckbox
                                            key={area.id}
                                            id={area.id}
                                            label={area.label}
                                            isSelected={formData.expertiseAreas?.includes(area.id) || false}
                                            onToggle={(id) => handleArrayToggle('expertiseAreas', id)}
                                            type="checkbox"
                                            uiType="light"
                                        />
                                    ))}
                                </div>
                                {validationErrors.expertiseAreasError && (
                                    <p className="text-app-red text-sm mt-3">{validationErrors.expertiseAreasError}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-base font-medium text-app-dark mb-2 block">Grupa docelowa <span className="text-app-red">*</span></label>
                                <p className="text-sm text-app-silver mb-4">Komu chcesz pomagać:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {TARGET_AUDIENCE.map(audience => (
                                        <InputCheckbox
                                            key={audience.id}
                                            id={audience.id}
                                            label={audience.label}
                                            isSelected={formData.targetAudience?.includes(audience.id) || false}
                                            onToggle={(id) => handleArrayToggle('targetAudience', id)}
                                            type="checkbox"
                                            uiType="light"
                                        />
                                    ))}
                                </div>
                                {validationErrors.targetAudienceError && (
                                    <p className="text-app-red text-sm mt-3">{validationErrors.targetAudienceError}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SEKCJA: DOŚWIADCZENIE */}
                    {activeSection === 'experience' && (
                        <div className="space-y-8">
                            <div>
                                <label className="text-base font-medium text-app-dark mb-2 block">Tematy mentoringu <span className="text-app-red">*</span></label>
                                <p className="text-sm text-app-silver mb-4">W jakich obszarach oferujesz wsparcie:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {MENTORING_TOPICS.map(topic => (
                                        <InputCheckbox
                                            key={topic.id}
                                            id={topic.id}
                                            label={topic.label}
                                            isSelected={formData.mentoringTopics?.includes(topic.id) || false}
                                            onToggle={(id) => handleArrayToggle('mentoringTopics', id)}
                                            type="checkbox"
                                            uiType="light"
                                        />
                                    ))}
                                </div>
                                {validationErrors.mentoringTopicsError && (
                                    <p className="text-app-red text-sm mt-3">{validationErrors.mentoringTopicsError}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-base font-medium text-app-dark mb-2 block">Branże <span className="text-app-red">*</span></label>
                                <p className="text-sm text-app-silver mb-4">W jakich branżach masz doświadczenie:</p>
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
                                <MProfileCreatorFormSkillInput
                                    skills={formData.skills || []}
                                    onAdd={handleSkillAdd}
                                    onRemove={handleSkillRemove}
                                    placeholder="Dodaj umiejętność..."
                                />
                                {validationErrors.skillsError && (
                                    <p className="text-app-red text-sm mt-3">{validationErrors.skillsError}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SEKCJA: DODATKOWE UWAGI */}
                    {activeSection === 'format' && (
                        <div className="space-y-8">
                            <div>
                                <Textarea
                                    isLabel={true}
                                    labelCaption="Dodatkowe uwagi"
                                    name="additional-notes"
                                    type="text"
                                    placeholder="Opisz swoje podejście do mentoringu, dostępność, preferowane formy współpracy..."
                                    uiType="light"
                                    value={formData.additionalNotes}
                                    onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
                                    validateError={validationErrors.additionalNotesError}
                                    rows={6}
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-10">
                        <Button type="submit" uiType="primary" size="regularSize">Zapisz profil mentora</Button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default MProfileCreatorForm;