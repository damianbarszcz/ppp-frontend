import React  from "react";
import {Mentor} from "@/app/types";
import Button from "@/app/components/ui/Button";

const SubscriptionMentorModal: React.FC<{
    mentor: Mentor,
    closeSubscriptionModal: (value: boolean) => void;
    handleSubscribe: () => void;
}> = ({ mentor,closeSubscriptionModal,handleSubscribe }) => {

    return (
        <div className="fixed inset-0 bg-app-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={() => closeSubscriptionModal(false)}>
            <div className="bg-app-white rounded-lg w-full max-w-md p-8" onClick={(e) => e.stopPropagation()}>
                <div className="text-center">
                    <div className="mb-6">
                        <header className="mb-5">
                            <h3 className="text-2xl font-semibold text-app-dark mb-2">Treść premium</h3>
                        </header>
                        <p className="text-app-silver text-base">
                            Ten artykuł jest dostępny tylko dla subskrybentów mentora
                            <span className="ml-1 font-semibold">@{mentor.profile.username}</span>
                        </p>
                    </div>

                    <div>
                        <p className="text-app-silver text-base">
                            <span>Subskrybuj za:</span>
                            <span className="ml-1 font-semibold">{mentor.profile.mentor_subscribe_price} zł / miesiąc</span>
                        </p>
                    </div>

                    <div className="mt-10 flex justify-center">
                        <div className="mr-5">
                            <Button type="button" uiType="dark-outline" size="smallSize"
                                    onClick={() => closeSubscriptionModal(false)}>
                                Anuluj
                            </Button>
                        </div>

                        <div>
                            <Button type="button" uiType="primary" size="smallSize" onClick={handleSubscribe}>Subskrybuj</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionMentorModal;