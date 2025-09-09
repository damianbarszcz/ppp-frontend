import React from "react";

interface Section {
    id: string;
    label: string;
}

interface ProfileCreatorFormSelectionProps {
    activeSection: string;
    setActiveSection: (sectionId: string) => void;
}

const sections: Section[] = [
    { id: 'basic', label: 'Podstawowe' },
    { id: 'collaboration', label: 'Ekspertyza' },
    { id: 'experience', label: 'Mentoring' },
    { id: 'format', label: 'Dodatkowe' }
];

const MProfileCreatorFormSelection: React.FC<ProfileCreatorFormSelectionProps> = ({
                                                                                      activeSection,
                                                                                      setActiveSection
                                                                                  }: ProfileCreatorFormSelectionProps) => {
    return (
        <div className="flex space-x-1 mb-8 bg-app-white border border-app-dark-white p-1 rounded-md">
            {sections.map(section => (
                <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`flex-1 py-2 px-4 rounded-md text-base font-medium transition-colors ${
                        activeSection === section.id ?
                            'bg-app-white text-app-blue' : 'text-gray-600 hover:text-blue-600'
                    }`}
                >
                    {section.label}
                </button>
            ))}
        </div>
    );
};

export default MProfileCreatorFormSelection;