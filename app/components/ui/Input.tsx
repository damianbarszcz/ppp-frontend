import React from "react";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>{
    placeholder: string
    type: string
    name: string
    labelCaption: string
    uiType: "light" | "dark";
    required?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({placeholder, type, name, uiType, labelCaption, required,onChange, ...rest })  => {
    const inputStyle = uiType === "light" ? styles.input_light : styles.input_dark;
    const labelStyle = uiType === "light" ? styles.label_light : styles.label_dark;

    return (
        <div className="mb-10 flex flex-col">
            <label htmlFor={name} aria-label={labelCaption} className={`${labelStyle} font-body text-base font-medium mb-2 block`}>
                {labelCaption}
            </label>
            <input
                className={`${styles.input} ${inputStyle} w-full font-body font-medium text-base`}
                name={name}
                type={type}
                placeholder={placeholder}
                aria-required={required ? "true" : "false"}
                onChange={onChange}
                required={required}
                {...rest}
            />
        </div>
    );
};

export default Input;