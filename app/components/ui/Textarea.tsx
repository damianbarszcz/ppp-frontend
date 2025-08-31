import React from "react";
import styles from "./Input.module.css";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>{
    placeholder: string
    type: string
    name: string
    isLabel: boolean
    labelCaption: string
    uiType: "light" | "dark";
    required?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    validateError: string;
}

const Textarea: React.FC<TextareaProps> = ({placeholder, type, name, uiType, labelCaption, validateError, required,onChange, isLabel, rows, ...rest })  => {
    const inputStyle = uiType === "light" ? styles.input_light : styles.input_dark;
    const labelStyle = uiType === "light" ? styles.label_light : styles.label_dark;

    return (
        <div className="flex flex-col relative">
            {isLabel ?
                <label htmlFor={name} aria-label={labelCaption} className={`${labelStyle} font-body text-base font-medium mb-2 block`}>
                    {labelCaption}
                </label> : ''}

                <textarea
                    className={`${styles.input} ${inputStyle} w-full font-body font-medium text-base`}
                    name={name}
                    placeholder={placeholder}
                    aria-required={required ? "true" : "false"}
                    onChange={onChange}
                    required={required}
                    rows={rows}
                    {...rest}>
                </textarea>

                {validateError ? <span className="absolute bottom-[-30px] font-body text-sm global--text-error">{validateError}</span> : ''}
        </div>

    )
};

export default Textarea;