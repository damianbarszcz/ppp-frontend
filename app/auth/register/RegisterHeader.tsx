import React from "react";

const RegisterHeader: React.FC = () => {
    return(
        <header className="mt-10">
            <div className="text-center">
                <h1 className="font-heading text-3xl font-semibold global--text-white">Zarejestruj swoje konto</h1>
            </div>

            <div className="text-center mt-5">
                <p className="font-body text-base font-medium global--text-d-silver">Aby utworzyć konto przejdź 3-etapową rejestracje.</p>
            </div>
        </header>
    )
}

export default RegisterHeader;