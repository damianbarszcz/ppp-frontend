import React from "react";
import { User } from '@/app/types/user.types';
import {useSubscription} from "@/app/context/SubscriptionContext";
interface SettingsPaymentsProps{
    user: User
}

const SettingsPayments : React.FC<SettingsPaymentsProps> = () => {
    const { hasMentorPlus } = useSubscription();

    return (
        <section className="w-full mt-10 col-span-9">
            <header>
                <h2 className="text-xl font-semibold mb-2 font-body global--text-black">Twój plan</h2>
                <p className="text-base mb-5 font-body global--text-silver">Twój aktualnie aktywny plan.</p>
            </header>

            <div className="global--border-d-white rounded-md mb-2">
                <div className="pt-2 pb-2">
                    <div className="grid grid-cols-3 items-center justify-between p-7">
                        <div>
                            <h3 className="font-body text-sm global--text-silver font-medium">Plan</h3>
                            <p className="font-body text-2xl mt-3 global--text-black font-semibold">{ hasMentorPlus  ? 'Mentor+' : 'Free' }</p>
                        </div>

                        <div>
                            <h3 className="font-body text-sm global--text-silver font-medium">Płatność</h3>

                            <div className="font-body text-xl mt-3">
                                <span className="font-body text-2xl global--text-black font-semibold"> { hasMentorPlus ? '60.00 zł' : '0.00 zł' } </span>
                                <span className="font-body text-sm global--text-silver font-medium">/ Płatność jednorazowa</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SettingsPayments;
