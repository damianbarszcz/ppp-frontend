import React, { useState } from "react";
import Button from "@/app/components/ui/Button";

interface SearchCreatorStage3Props {
    nextStage: () => void;
    updateFormData: (data: any) => void;
    formData: any;
}

interface MeetingFrequency {
    id: string;
    title: string;
    description: string;
}

interface SessionLength {
    id: string;
    title: string;
    description: string;
}

interface TimePreference {
    id: string;
    title: string;
    description: string;
}

interface WorkStyle {
    id: string;
    title: string;
    description: string;
}

const MEETING_FREQUENCIES: MeetingFrequency[] = [
    {
        id: 'daily',
        title: 'Codziennie',
        description: 'Regularne codzienne sesje'
    },
    {
        id: 'few-times-week',
        title: '2-3x w tygodniu',
        description: 'Intensywna współpraca'
    },
    {
        id: 'weekly',
        title: 'Tygodniowo',
        description: 'Regularne spotkania co tydzień'
    },
    {
        id: 'bi-weekly',
        title: 'Co 2 tygodnie',
        description: 'Spotkania co dwa tygodnie'
    },
    {
        id: 'monthly',
        title: 'Miesięcznie',
        description: 'Rzadsze, ale dłuższe sesje'
    }
];

const SESSION_LENGTHS: SessionLength[] = [
    {
        id: '30min',
        title: '30 minut',
        description: 'Krótkie, skoncentrowane sesje'
    },
    {
        id: '1hour',
        title: '1 godzina',
        description: 'Standardowa długość spotkania'
    },
    {
        id: '2hours',
        title: '2 godziny',
        description: 'Dłuższe sesje robocze'
    },
    {
        id: 'flexible',
        title: 'Elastycznie',
        description: 'W zależności od potrzeb'
    }
];

const TIME_PREFERENCES: TimePreference[] = [
    {
        id: 'morning',
        title: 'Rano (8:00-12:00)',
        description: 'Jestem najproduktywniejszy rano'
    },
    {
        id: 'afternoon',
        title: 'Południe (12:00-17:00)',
        description: 'Preferuję popołudniowe godziny'
    },
    {
        id: 'evening',
        title: 'Wieczorem (17:00-21:00)',
        description: 'Najlepsze godziny po pracy'
    },
    {
        id: 'flexible',
        title: 'Elastycznie',
        description: 'Dostosowuję się do potrzeb'
    }
];

const WORK_STYLES: WorkStyle[] = [
    {
        id: 'structured',
        title: 'Strukturalny',
        description: 'Lubię jasne plany, deadliny i organizację'
    },
    {
        id: 'agile',
        title: 'Agile/Scrum',
        description: 'Iteracyjne podejście, sprinty, retrospektywy'
    },
    {
        id: 'creative',
        title: 'Kreatywny',
        description: 'Swoboda, burze mózgów, eksperymentowanie'
    },
    {
        id: 'result-oriented',
        title: 'Zorientowany na wyniki',
        description: 'Najważniejszy jest efekt końcowy'
    }
];

const SearchCreatorStage3: React.FC<SearchCreatorStage3Props> = ({
     nextStage,
      updateFormData,
      formData
                                                                 }) => {
    const [selectedFrequency, setSelectedFrequency] = useState<string>(
        formData.meetingFrequency || ''
    );
    const [selectedLength, setSelectedLength] = useState<string>(
        formData.sessionLength || ''
    );
    const [selectedTimePreferences, setSelectedTimePreferences] = useState<string[]>(
        formData.timePreferences || []
    );
    const [selectedWorkStyles, setSelectedWorkStyles] = useState<string[]>(
        formData.workStyles || []
    );

    const handleFrequencySelect = (frequencyId: string) => {
        setSelectedFrequency(frequencyId);
        updateFormData({ meetingFrequency: frequencyId });
    };

    const handleLengthSelect = (lengthId: string) => {
        setSelectedLength(lengthId);
        updateFormData({ sessionLength: lengthId });
    };

    const toggleTimePreference = (timeId: string) => {
        const newPreferences = selectedTimePreferences.includes(timeId)
            ? selectedTimePreferences.filter(t => t !== timeId)
            : [...selectedTimePreferences, timeId];

        setSelectedTimePreferences(newPreferences);
        updateFormData({ timePreferences: newPreferences });
    };

    const toggleWorkStyle = (styleId: string) => {
        const newStyles = selectedWorkStyles.includes(styleId)
            ? selectedWorkStyles.filter(s => s !== styleId)
            : [...selectedWorkStyles, styleId];

        setSelectedWorkStyles(newStyles);
        updateFormData({ workStyles: newStyles });
    };

    const canProceed = selectedFrequency && selectedLength &&
        selectedTimePreferences.length > 0 && selectedWorkStyles.length > 0;

    return (
        <div className="max-w-5xl min-h-[90vh] max-h-[90vh] m-auto flex flex-col py-10 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col justify-between flex-1 global--border-d-white rounded-md p-10">
                <header>
                    <h1 className="text-2xl font-bold text-app-dark mb-4">Preferencje komunikacyjne</h1>
                    <p className="text-base font-regular text-app-silver leading-[30px]">
                        Określ jak chcesz współpracować i kiedy jesteś dostępny.
                    </p>
                </header>

                <div className="flex-1">
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Częstotliwość spotkań</h2>
                            <p className="text-sm text-app-silver mb-4">Jak często chciałbyś się spotykać:</p>
                        </header>

                        <div className="grid grid-cols-1 gap-3">
                            {MEETING_FREQUENCIES.map(frequency => (
                                <div
                                    key={frequency.id}
                                    onClick={() => handleFrequencySelect(frequency.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedFrequency === frequency.id
                                            ? 'global--border-blue global--bg-light-blue'
                                            : 'global--border-d-white hover:global--border-silver'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <header>
                                            <h3 className="font-semibold text-app-dark">{frequency.title}</h3>
                                            <p className="text-sm text-app-silver">{frequency.description}</p>
                                        </header>
                                        <input
                                            type="radio"
                                            name="frequency"
                                            checked={selectedFrequency === frequency.id}
                                            onChange={() => {}}
                                            className="text-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sekcja 2: Długość sesji */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Długość sesji</h2>
                            <p className="text-sm text-app-silver mb-4">Preferowana długość spotkań:</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {SESSION_LENGTHS.map(length => (
                                <div
                                    key={length.id}
                                    onClick={() => handleLengthSelect(length.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedLength === length.id
                                            ? 'global--border-blue global--bg-light-blue'
                                            : 'global--border-d-white hover:global--border-silver'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <header>
                                            <h3 className="font-semibold text-app-dark">{length.title}</h3>
                                            <p className="text-sm text-app-silver">{length.description}</p>
                                        </header>
                                        <input
                                            type="radio"
                                            name="sessionLength"
                                            checked={selectedLength === length.id}
                                            onChange={() => {}}
                                            className="text-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sekcja 3: Preferowane godziny */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Preferowane godziny</h2>
                            <p className="text-sm text-app-silver mb-4">Kiedy jesteś najproduktywniejszy:</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {TIME_PREFERENCES.map(time => (
                                <div
                                    key={time.id}
                                    onClick={() => toggleTimePreference(time.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedTimePreferences.includes(time.id)
                                            ? 'global--border-blue global--bg-light-blue'
                                            : 'global--border-d-white hover:global--border-silver'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <header>
                                            <h3 className="font-semibold text-app-dark">{time.title}</h3>
                                            <p className="text-sm text-app-silver">{time.description}</p>
                                        </header>
                                        <input
                                            type="checkbox"
                                            checked={selectedTimePreferences.includes(time.id)}
                                            onChange={() => {}}
                                            className="text-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sekcja 4: Styl pracy */}
                    <div className="mt-10 mb-10">
                        <header>
                            <h2 className="text-lg font-semibold text-app-dark mb-4">Styl pracy</h2>
                            <p className="text-sm text-app-silver mb-4">Jakie podejście do pracy preferujesz:</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {WORK_STYLES.map(style => (
                                <div
                                    key={style.id}
                                    onClick={() => toggleWorkStyle(style.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedWorkStyles.includes(style.id)
                                            ? 'global--border-blue global--bg-light-blue'
                                            : 'global--border-d-white hover:global--border-silver'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <header>
                                            <h3 className="font-semibold text-app-dark">{style.title}</h3>
                                            <p className="text-sm text-app-silver">{style.description}</p>
                                        </header>
                                        <input
                                            type="checkbox"
                                            checked={selectedWorkStyles.includes(style.id)}
                                            onChange={() => {}}
                                            className="text-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
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

export default SearchCreatorStage3;