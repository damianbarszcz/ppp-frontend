import React from "react";

interface PaymentProcessSuccessProps{
    handleGoBack: () => void;
    username: string;
}

const PaymentProcessSuccess :  React.FC<PaymentProcessSuccessProps> = ({handleGoBack,username} : PaymentProcessSuccessProps) => {

    return (
        <section className="flex justify-center items-center h-screen bg-app-white">
            <div className="text-center max-w-lg">
                <header className="max-w-md m-auto">
                    <h1 className="text-3xl font-bold mb-10 text-app-green">Płatność zakończona sukcesem!</h1>
                </header>

                <p className="text-base font-medium global--dark mb-10">
                    Twoja subskrypcja mentora @{username} została aktywowana
                </p>

                <button onClick={handleGoBack} className="px-6 py-3 bg-app-dark text-app-white rounded-lg font-semibold hover:opacity-90">
                    Przejdź do panelu
                </button>
            </div>
        </section>
    );
}

export default PaymentProcessSuccess;
