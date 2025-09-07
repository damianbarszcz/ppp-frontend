import React from "react";

const PaymentProcessLoading :  React.FC = () => {

    return (
        <section className="flex justify-center items-center h-screen bg-app-white">
            <div className="text-center max-w-lg">
                <header className="max-w-md m-auto">
                    <h1 className="text-3xl font-bold mb-10 text-app-dark">Przetwarzanie płatności...</h1>
                </header>

                <p className=" text-base font-medium text-app-dark mb-10">Proszę czekać, zapisujemy Twoją subskrypcję.</p>
            </div>
        </section>
    );
}

export default PaymentProcessLoading;
