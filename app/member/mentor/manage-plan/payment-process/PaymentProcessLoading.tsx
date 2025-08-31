import React from "react";

const PaymentProcessLoading :  React.FC = () => {

    return (
        <section className="flex justify-center items-center h-screen global--bg-black">
            <div className="text-center max-w-lg">
                <header className="max-w-md m-auto">
                    <h1 className="text-3xl font-bold mb-10 global--text-white font-body">Przetwarzanie płatności...</h1>
                </header>

                <p className="font-body text-base font-medium global--text-d-silver mb-10">Proszę czekać, zapisujemy Twoją subskrypcję.</p>
            </div>
        </section>
    );
}

export default PaymentProcessLoading;
