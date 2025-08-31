import React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    type:"button" | "submit" | "reset" | undefined
    uiType: "primary" | "light" | "dark" | "dark-outline" | "blue-outline";
    size: "regularSize" | "longSize" | "smallSize" | "extraSmallSize";
}

const Button: React.FC<ButtonProps> = ({children,type,uiType,size,...props }) => {

    const getButtonStyle = () => {
        switch (uiType) {
            case "primary":
                return styles.button_primary;
            case "light":
                return styles.button_light;
            case "dark":
                return styles.button_dark;
            case "dark-outline":
                return styles.button_dark_outline;
            case "blue-outline":
                return styles.button_blue_outline;
            default:
                return styles.button_dark;
        }
    };

    const getButtonSize = () => {
        switch (size) {
            case "extraSmallSize":
                return "text-xs w-32 p-2.5";
            case "smallSize":
                return "text-sm w-32 p-3";
            case "regularSize":
                return "text-sm w-40 p-3.5";
            case "longSize":
                return "text-base w-full p-4";
            default:
                return "text-base w-full p-4";
        }
    };

    const buttonStyle = getButtonStyle();
    const buttonSize = getButtonSize();

    return (
        <button type={type} className={`${buttonStyle} ${buttonSize} font-semibold rounded-3xl`}{...props}>
            {children}
        </button>
    );
};

export default Button;