"use client";
import React from "react";
import Button from "@/app/components/ui/Button";

interface RegisterPanelStep3Props{
    handleRegister: (e:React.FormEvent) => void;
    formData: FormDataType;
}
interface FormDataType {
    name: string,
    surname: string,
    email: string,
    account_type: string
}

const RegisterPanelStep3 : React.FC<RegisterPanelStep3Props> = ({
    handleRegister, formData
}: RegisterPanelStep3Props) => {

    return (
        <div className="m-auto">
            <form onSubmit={handleRegister} className="mt-10 w-full">
                <div className="mt-10 m-auto max-w-md">
                    <div className="global--border-anthracite p-5 mb-10 rounded-md cursor-pointer flex-1 h-64">
                        <h3 className="text-xl font-semibold global--text-white">Podsumowanie</h3>
                        <p className="mt-3 font-medium text-base global--text-d-silver">Sprawdź poprawność danych.</p>
                        <ul className="text-xs mt-10">
                            <li className="global--text-d-silver text-base mb-3 font-light">Imię i Nazwisko: <span className="font-medium global--text-white"> {formData.name} {formData.surname} </span> </li>
                            <li className="global--text-d-silver text-base mb-3 font-light">Adres email: <span className="font-medium global--text-white"> {formData.email} </span>  </li>
                            <li className="global--text-d-silver text-base mb-3 font-light">Typ konta: <span className="font-medium global--text-white"> {formData.account_type === 'M' ? 'Mentor' : 'Poszukiwacz'} </span>  </li>
                        </ul>
                    </div>

                    <Button type="submit" uiType="light" size="longSize">Stwórz konto</Button>
                </div>
            </form>
        </div>
    );
}

export default  RegisterPanelStep3;
