import React, {useState} from "react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";

const MProfileCreatorFormSkillInput: React.FC<{
    skills: string[];
    onAdd: (skill: string) => void;
    onRemove: (index: number) => void;
    placeholder: string;
}> = ({ skills, onAdd, onRemove, placeholder }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (inputValue.trim() && !skills.includes(inputValue.trim())) {
            onAdd(inputValue.trim());
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div>
            <div className="flex items-end gap-3">
                <div className="flex-1">
                    <Input
                        isLabel={true}
                        labelCaption="Umiejętności"
                        name="skills"
                        type="text"
                        onKeyPress={handleKeyPress}
                        placeholder={placeholder}
                        uiType="light"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        validateError=""
                    />
                </div>

                <div className="pb-1">
                    <Button
                        type="button"
                        uiType="dark"
                        size="smallSize"
                        onClick={handleAdd}
                        disabled={!inputValue.trim() || skills.includes(inputValue.trim())}
                    >
                        Dodaj
                    </Button>
                </div>
            </div>

            {skills.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                            {skill}
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="text-blue-500 hover:text-blue-700 ml-1 font-bold"
                                title="Usuń umiejętność"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {skills.length === 0 && (
                <p className="text-sm text-app-silver mt-3 italic">
                    Nie dodano jeszcze żadnych umiejętności.
                </p>
            )}
        </div>
    );
};

export default MProfileCreatorFormSkillInput;