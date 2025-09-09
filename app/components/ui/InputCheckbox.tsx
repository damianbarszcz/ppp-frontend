import React from "react";
import styles from "./InputCheckbox.module.css";

interface RadioProps {
    id: string;
    label: string;
    description?: string;
    isSelected: boolean | undefined;
    onToggle: (id: string) => void;
    type: "checkbox" | "radio";
    uiType: "light" | "dark";
    disabled?: boolean;
    name?: string;
}

const InputCheckbox: React.FC<RadioProps> = ({
    id,
    label,
    description,
    isSelected,
    onToggle,
    type,
    uiType,
    disabled = false,
    name
}) => {
    const containerStyle = uiType === "light" ? styles.container_light : styles.container_dark;
    const selectedStyle = isSelected
        ? (uiType === "light" ? styles.selected_light : styles.selected_dark)
        : (uiType === "light" ? styles.unselected_light : styles.unselected_dark);

    return (
        <div className="relative">
            <div onClick={() => !disabled && onToggle(id)}
                className={`${styles.radio_container} ${containerStyle} ${selectedStyle} ${disabled ? styles.disabled : 'cursor-pointer'
                } p-3 border border-app-dark-white rounded-md transition-all`}>
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <span className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-app-dark'}`}>{label}</span>

                        {description && (
                            <p className={`text-xs mt-1 ${disabled ? 'text-gray-300' : 'text-app-silver'}`}>{description}</p>
                        )}
                    </div>

                    <input type={type} name={name} checked={isSelected} onChange={() => {}} disabled={disabled}
                        className={`${uiType === "light"
                                ? 'text-blue-500 focus:ring-blue-500'
                                : 'text-blue-400 focus:ring-blue-400'
                        } ${disabled ? 'opacity-50' : ''}`}
                        aria-label={label}
                    />
                </div>
            </div>
        </div>
    );
};

export default InputCheckbox;