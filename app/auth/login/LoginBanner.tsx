import React from "react";
import styles from "./LoginBanner.module.css";

const LoginBanner: React.FC = () => {
    return (
        <div className={`flex items-end ${styles.banner} h-full`}>
            <div className="ml-9 mb-12 max-w-2xl">
                <h2 className="font-heading text-6xl font-bold global--text-white">
                    Twoje <br/> miejsce  do  współpracy
                </h2>
                <div className="mt-6">
                    <p className="font-body text-xl font-medium global--text-d-silver leading-10">
                        Odkrywaj nowe możliwości, dziel się wiedzą i rozwijaj swoje kompetencje w gronie ekspertów.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginBanner;