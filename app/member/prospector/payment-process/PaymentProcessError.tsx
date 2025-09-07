import React from "react";

interface PaymentProcessErrorProps{
    handleGoBack: () => void;
    username: string;
}

const PaymentProcessError :  React.FC<PaymentProcessErrorProps> = ({handleGoBack, username} : PaymentProcessErrorProps) => {

    return (
        <section className="flex justify-center items-center h-screen bg-app-white">
            <div className="text-center max-w-lg">
                <header className="max-w-md m-auto">
                    <h1 className="text-3xl font-bold mb-10 text-app-red ">Wystąpił błąd</h1>
                </header>

                <p className="text-base font-medium text-app-light-silver mb-10">
                    Wystąpił błąd podczas przetwarzania płatności dla mentora @{username}
                </p>

                <button onClick={handleGoBack} className="px-6 py-3 bg-app-dark text-app-white rounded-lg font-semibold hover:opacity-90">
                    Powrót do planu
                </button>
            </div>
        </section>
    );
}

export default PaymentProcessError;
