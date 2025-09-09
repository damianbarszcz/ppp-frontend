import React, { useState } from "react";
import Button from "@/app/components/ui/Button";
import { COLLABORATION_AREAS } from "@/app/constans/profileContans";
import InputCheckbox from "@/app/components/ui/InputCheckbox";

interface SearchCreatorStage2Props {
    nextStage: () => void;
    updateFormData: (data: any) => void;
    formData: any;
}

const SearchCreatorStage2: React.FC<SearchCreatorStage2Props> = ({
    nextStage,
    updateFormData,
    formData
 }) => {
    const [selectedAreas, setSelectedAreas] = useState<string[]>(
        formData.collaboration_areas || []
    );

    const toggleArea = (areaId: string) => {
        const newAreas = selectedAreas.includes(areaId)
            ? selectedAreas.filter(a => a !== areaId)
            : [...selectedAreas, areaId];

        setSelectedAreas(newAreas);
        updateFormData({ collaboration_areas: newAreas });
    };

    const canProceed = selectedAreas.length > 0;

    return (
        <div className="max-w-5xl min-h-[80vh] max-h-[90vh] m-auto flex flex-col py-10 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col justify-between flex-1 global--border-d-white rounded-md p-10">
                <header>
                    <h1 className="text-2xl font-bold text-app-dark mb-4">Obszary współpracy</h1>
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
                                <InputCheckbox
                                    key={area.id}
                                    id={area.id}
                                    label={area.label}
                                    isSelected={selectedAreas.includes(area.id) || false}
                                    onToggle={() => toggleArea(area.id)}
                                    type="checkbox"
                                    uiType="light"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end  items-center mt-6">
                    <Button type="button" uiType="primary" size="regularSize" onClick={nextStage} disabled={!canProceed}>Dalej</Button>
                </div>
            </div>
        </div>
    );
};

export default SearchCreatorStage2;