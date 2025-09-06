"use client";
import React from "react";
import Button from "@/app/components/ui/Button";
import {RegisterPanelStep3Props} from "@/app/types";

const RegisterPanelStep3 : React.FC<RegisterPanelStep3Props> = ({
    handleRegister, formData
}: RegisterPanelStep3Props) => {

    return (
        <div className="m-auto">
            <form onSubmit={handleRegister} className="mt-10 w-full">
                <div className="mt-10 m-auto max-w-md">
                    <div className="border border-app-anthracite p-5 mb-10 rounded-md cursor-pointer flex-1 h-64">
                        <h3 className="text-xl font-semibold text-app-white">Podsumowanie</h3>
                        <p className="mt-3 font-medium text-base text-app-light-silver">Sprawdź poprawność danych.</p>
                        <ul className="text-xs mt-10">
                            <li className="text-app-light-silver text-base mb-3 font-medium">Imię i Nazwisko: <span className="font-medium text-app-white"> {formData.name} {formData.surname} </span> </li>
                            <li className="text-app-light-silver text-base mb-3 font-medium">Adres email: <span className="font-medium text-app-white"> {formData.email} </span>  </li>
                            <li className="text-app-light-silver text-base mb-3 font-medium">Typ konta: <span className="font-medium text-app-white"> {formData.account_type === 'M' ? 'Mentor' : 'Poszukiwacz'} </span>  </li>
                        </ul>
                    </div>

                    <Button type="submit" uiType="light" size="fullSize">Stwórz konto</Button>
                </div>
            </form>
        </div>
    );
}

export default  RegisterPanelStep3;
