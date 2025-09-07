import React from "react";

interface PaymentProcessSuccessProps{
    handleGoBack: () => void;
}

const PaymentProcessSuccess :  React.FC<PaymentProcessSuccessProps> = ({handleGoBack} : PaymentProcessSuccessProps) => {

    return (
        <section className="flex justify-center items-center h-screen bg-app-black">
            <div className="text-center max-w-lg">
                <header className="max-w-md m-auto">
                    <h1 className="text-3xl font-bold mb-10 text-app-green">Płatność zakończona sukcesem!</h1>
                </header>

                <p className="text-base font-medium global--text-d-silver mb-10">
                    Twoja subskrypcja Mentor+ została pomyślnie aktywowana.
                    Teraz możesz korzystać ze wszystkich funkcji premium.
                </p>

                <button onClick={handleGoBack} className="px-8 py-3 bg-app-white text-app-blue rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    Przejdź do panelu
                </button>
            </div>
        </section>
    );
}

export default PaymentProcessSuccess;
