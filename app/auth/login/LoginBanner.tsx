import React from "react";
import styles from "./LoginBanner.module.css";

const LoginBanner: React.FC = () => {
    return (
        <div className={`flex items-end ${styles.banner} h-full`}>
            <div className="ml-9 mb-12 max-w-2xl">
                <h1 className="text-6xl font-bold text-app-white">
                    Twoje <br/> miejsce  do  współpracy
                </h1>

                <div className="mt-6">
                    <p className="text-xl font-medium text-app-light-silver leading-10">
                        Odkrywaj nowe możliwości, dziel się wiedzą i rozwijaj swoje kompetencje w gronie ekspertów.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginBanner;