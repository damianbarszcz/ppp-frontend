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
                            <p className="font-body text-xl font-semibold global--text-white">Darmowy</p>
                            <p className="font-body mt-5 mb-6 text-base global--text-d-silver">
                                Dowiedz się jak aplikacja może pomóc Ci w wykonywaniu codziennych zadań.
                            </p>
                        </div>

                        <div className="mt-10 flex items-end">
                            <div><p className="font-body text-4xl font-semibold global--text-white">0 zł</p></div>
                            <div><p className="font-body text-base ml-2 global--text-d-silver">/ Płatność jednorazowa</p></div>
                        </div>

                        <div className="mt-10">
                            <button type="button" className="block pt-4 pb-4 w-full global--bg-dark rounded-3xl text-sm font-body font-semibold
                        global--text-white cursor-not-allowed opacity-30">Twój bieżący plan
                            </button>
                        </div>

                        <ul className="mt-10 text-xs">
                            <li className="font-body global--text-d-silver text-sm mb-3">✓ Publikacja materiałów w formie mikrobloga</li>
                            <li className="font-body global--text-d-silver text-sm mb-3">✓ Tworzenie treści płatnych i bezpłatnych</li>
                            <li className="font-body global--text-d-silver text-sm mb-3">✓ Przeglądanie listy obserwatorów</li>
                        </ul>
                    </div>
                </div>

                <div className="flex-1 h-[612px] rounded-md global--border-blue bg-blue-500/10 backdrop-blur-sm">
                    <div className="p-10 h-full flex flex-col">
                        <div>
                            <p className="font-body text-xl font-semibold global--text-white">Mentor +</p>
                            <p className="font-body mt-5 text-base global--text-d-silver">
                                Zwiększ wydajność swojego konta dzięki lepszej ekspozycji wśród innych użytkowników.
                            </p>
                        </div>

                        <div className="mt-10 flex items-end">
                            <div><p className="font-body text-4xl font-semibold global--text-white">60 zł</p></div>
                            <div><p className="font-body text-base ml-2 global--text-d-silver">/ Płatność jednorazowa</p></div>
                        </div>

                        <div className="mt-10">
                            <button type="button" className="block pt-4 pb-4 w-full global--bg-white rounded-3xl text-sm font-body font-semibold
                            global--text-link" onClick={handleSubscribe}>Uzyskaj subskrypcje Mentor+</button>
                        </div>

                        <ul className="text-xs mt-10">
                            <li className="font-body global--text-d-silver text-sm mb-3">✓ Wszysko to co w planie darmowym</li>
                            <li className="font-body global--text-d-silver text-sm mb-3">✓ Lepsze docieranie do odbiorców dzięki funkcjonalności pozycjonowania </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ManagePlanPricing;