import React from "react";

interface RegisterStepsProps{
    step: number,
}

const RegisterSteps:  React.FC<RegisterStepsProps>  = ({ step }) => {

    return(
        <div className="m-auto max-w-2xl">
            <div className="mt-10 flex justify-between gap-4">
                <div className={`${step == 1 ? 'global--bg-white' : 'global--bg-anthracite'} flex p-2 h-12 w-1/3 rounded-md`}>
                    <span className={`${step == 1  ? 'global--bg-blue global--text-white' : 'global--bg-l-dark global--text-white'} absolute w-7 h-7 mt-1 pt-0.5 font-body text-sm font-semibold global--white-text rounded-full text-center`}>1</span>
                    <span className={`${step == 1  ? 'global--text-blue' : 'global--text-white'} ml-9 font-body text-sm font-medium pt-1.5`}>Wprowadz dane</span>
                </div>

                <div className={`${step == 2 ? 'global--bg-white' : 'global--bg-anthracite'} flex p-2 h-12 w-1/3 rounded-md`}>
                    <span className={`${step == 2  ? 'global--bg-blue global--text-white' : 'global--bg-l-dark global--text-white'} absolute w-7 h-7 mt-1 pt-0.5 font-body text-sm font-semibold global--white-text rounded-full text-center`}>2</span>
                    <span className={`${step == 2  ? 'global--text-blue' : 'global--text-white'} ml-9 font-body text-sm font-medium pt-1.5`}>Wybierz role</span>
                </div>

                <div className={`${step == 3 ? 'global--bg-white' : 'global--bg-anthracite'} flex p-2 h-12 w-1/3 rounded-md`}>
                    <span className={`${step == 3  ? 'global--bg-blue global--text-white' : 'global--bg-l-dark global--text-white'} absolute w-7 h-7 mt-1 pt-0.5 font-body text-sm font-semibold global--white-text rounded-full text-center`}>3</span>
                    <span className={`${step == 3  ? 'global--text-blue' : 'global--text-white'} ml-9 font-body text-sm font-medium pt-1.5`}>Podsumowanie</span>
                </div>
            </div>
        </div>
    )
}

export default RegisterSteps;