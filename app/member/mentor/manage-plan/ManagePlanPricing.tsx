import React from "react";

interface ManagePlanPricingProps{
    handleSubscribe: () => void;
}

const ManagePlanPricing : React.FC<ManagePlanPricingProps> = ({
    handleSubscribe
}: ManagePlanPricingProps) => {

    return (
        <section className="m-auto mt-1 w-full">
            <div className="flex gap-4 m-auto max-w-3xl">
                <div className="flex-1 h-[612px] rounded-md global--border-anthracite">
                    <div className="p-10 h-full flex flex-col">
                        <div>
                            <p className="text-xl font-semibold text-app-white">Darmowy</p>
                            <p className="mt-5 mb-6 text-base text-app-light-silver">
                                Dowiedz się jak aplikacja może pomóc Ci w wykonywaniu codziennych zadań.
                            </p>
                        </div>

                        <div className="mt-10 flex items-end">
                            <div><p className="text-4xl font-semibold text-app-white">0 zł</p></div>
                            <div><p className="text-base ml-2 text-app-light-silver">/ Płatność miesieczna</p></div>
                        </div>

                        <div className="mt-10">
                            <button type="button" className="block pt-4 pb-4 w-full bg-app-dark rounded-3xl text-sm font-semibold
                            text-app-white cursor-not-allowed opacity-30">Twój bieżący plan
                            </button>
                        </div>

                        <ul className="mt-10 text-xs">
                            <li className="text-app-light-silver text-sm mb-3">✓ Publikacja materiałów w formie mikrobloga</li>
                            <li className="text-app-light-silver text-sm mb-3">✓ Tworzenie treści płatnych i bezpłatnych</li>
                            <li className="text-app-light-silver text-sm mb-3">✓ Przeglądanie listy obserwatorów</li>
                        </ul>
                    </div>
                </div>

                <div className="flex-1 h-[612px] rounded-md global--border-blue bg-blue-500/10 backdrop-blur-sm">
                    <div className="p-10 h-full flex flex-col">
                        <div>
                            <p className="text-xl font-semibold text-app-white">Mentor +</p>
                            <p className="mt-5 text-base text-app-light-silver">
                                Zwiększ wydajność swojego konta dzięki lepszej ekspozycji wśród innych użytkowników.
                            </p>
                        </div>

                        <div className="mt-10 flex items-end">
                            <div><p className="text-4xl font-semibold text-app-white">60 zł</p></div>
                            <div><p className="text-base ml-2 text-app-light-silver">/ Płatność miesieczna</p></div>
                        </div>

                        <div className="mt-10">
                            <button type="button" className="block pt-4 pb-4 w-full bg-app-white rounded-3xl text-sm font-semibold
                            text-app-blue" onClick={handleSubscribe}>Uzyskaj subskrypcje Mentor+</button>
                        </div>

                        <ul className="text-xs mt-10">
                            <li className="text-app-light-silver text-sm mb-3">✓ Wszysko to co w planie darmowym</li>
                            <li className="text-app-light-silver text-sm mb-3">✓ Lepsze docieranie do odbiorców dzięki funkcjonalności pozycjonowania </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ManagePlanPricing;