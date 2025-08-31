import React from "react";

const SettingsHeader : React.FC = () => {

    return (
        <header className="pt-10 pb-1 max-w-6xl m-auto border-b global--b-border-d-white">
            <h1 className="text-3xl font-bold mb-5 font-body global--text-black">Ustawienia</h1>

            <p className="text-base mb-8 font-body global--text-dark">Zarządzaj ustawieniami i preferencjami swojego konta.</p>
        </header>
    );
}

export default SettingsHeader;
