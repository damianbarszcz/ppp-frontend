import React from "react";

interface RegisterStepsProps{
    step: number,
}

const RegisterSteps:  React.FC<RegisterStepsProps>  = ({ step } : RegisterStepsProps) => {

    return(
        <div className="m-auto max-w-2xl">
            <div className="mt-10 flex justify-between gap-4">
                <div className={`${step == 1 ? 'bg-app-white' : 'global--bg-anthracite'} flex p-2 h-12 w-1/3 rounded-md`}>
                    <span className={`${step == 1  ? 'bg-app-blue text-app-white' : 'bg-app-dark  text-app-white'} absolute w-7 h-7 mt-1 pt-0.5 text-sm font-semibold text-app-white rounded-full text-center`}>1</span>
                    <span className={`${step == 1  ? 'text-app-blue' : 'text-app-white'} ml-9 text-sm font-medium pt-1.5`}>Wprowadz dane</span>
                </div>

                <div className={`${step == 2 ? 'bg-app-white' : 'global--bg-anthracite'} flex p-2 h-12 w-1/3 rounded-md`}>
                    <span className={`${step == 2  ? 'bg-app-blue  text-app-white' : 'bg-app-dark  text-app-white'} absolute w-7 h-7 mt-1 pt-0.5 text-sm font-semibold text-app-white rounded-full text-center`}>2</span>
                    <span className={`${step == 2  ? 'text-app-blue' : 'text-app-white'} ml-9 text-sm font-medium pt-1.5`}>Wybierz role</span>
                </div>

                <div className={`${step == 3 ? 'bg-app-white' : 'global--bg-anthracite'} flex p-2 h-12 w-1/3 rounded-md`}>
                    <span className={`${step == 3  ? 'bg-app-blue  text-app-white' : 'bg-app-dark text-app-white'} absolute w-7 h-7 mt-1 pt-0.5 text-sm font-semibold text-app-white rounded-full text-center`}>3</span>
                    <span className={`${step == 3  ? 'text-app-blue' : 'text-app-white'} ml-9 text-sm font-medium pt-1.5`}>Podsumowanie</span>
                </div>
            </div>
        </div>
    )
}

export default RegisterSteps;