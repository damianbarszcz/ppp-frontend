import React, {useState} from "react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";

const ProfileCreatorFormSkillInput: React.FC<{
    skills: string[];
    onAdd: (skill: string) => void;
    onRemove: (index: number) => void;
    placeholder: string;
}> = ({ skills, onAdd, onRemove, placeholder }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAddSkill = () => {
        if (inputValue.trim()) {
            onAdd(inputValue.trim());
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    return (
        <div>
            <div className="flex items-end">
                <div className="w-full ">
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

                <div className="pl-5">
                    <Button type="button" uiType="dark" size="smallSize" onClick={handleAddSkill}>Dodaj</Button>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-app-dark text-app-white rounded-full text-sm flex items-center gap-2">
                        {skill}
                        <button type="button" onClick={() => onRemove(index)} className="text-app-white  ml-1">×</button>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ProfileCreatorFormSkillInput;