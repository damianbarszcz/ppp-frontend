import React from "react";

const RegisterHeader: React.FC = () => {
    return(
        <header className="mt-10">
            <div className="text-center">
                <h1 className="text-3xl font-semibold text-app-white">Zarejestruj swoje konto</h1>
            </div>

            <div className="text-center mt-5">
                <p className="text-base font-medium text-app-light-silver">Aby utworzyć konto przejdź 3-etapową rejestracje.</p>
            </div>
        </header>
    )
}

export default RegisterHeader;