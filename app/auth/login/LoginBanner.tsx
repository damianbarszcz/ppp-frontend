import React from "react";
import styles from "./LoginBanner.module.css";

const LoginBanner: React.FC = () => {
    return (
        <div className={`${styles.banner} h-full`}>
            <div className={`${styles.inner}`}>
                <div className={`${styles.content} w-[500px]`}>
                    <h2 className="font-heading text-5xl font-semibold global--text-white">
                        Twoje miejsce  do  współpracy
                    </h2>
                    <div className="mt-6">
                        <p className="font-body text-xl font-medium global--text-d-silver">
                            Odkrywaj nowe możliwości, dziel się wiedzą i rozwijaj swoje kompetencje w gronie ekspertów.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginBanner;