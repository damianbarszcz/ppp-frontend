import React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    type:"button" | "submit" | "reset" | undefined
    uiType: "light" | "dark";
}

const Button: React.FC<ButtonProps> = ({children,type,uiType}) => {
    const buttonStyle = uiType === "light" ? styles.button_light : styles.button_dark;

    return (
        <button type={type} className={`${styles.button} ${buttonStyle} w-full font-body font-semibold text-base`}>{children}</button>
    );
};

export default Button;