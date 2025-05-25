import React from "react";
import styles from "@/app/member/search-creator/SearchCreatorSteps.module.css";

interface SearchCreatorStepsProps {
    stage: number;
}

const SearchCreatorSteps : React.FC<SearchCreatorStepsProps> = ({ stage }) => {

    return (
        <div className={`flex justify-center content-center ${styles.banner} h-full`}>
            <div className="max-w-2xl mt-32">
                <div className="flex items-center mb-12 relative">
                    <div className="absolute top-[60px] left-[30px] h-[50px] border border-dashed border-white z-0" />

                    <div className={`relative w-[60px] h-[60px] inline-block rounded-full ${stage >= 1 ? 'bg-white' : 'bg-transparent'} `}>
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-xl global--text-link">1</span>
                    </div>

                    <span className="ml-10 font-body font-semibold text-base text-white">Start</span>
                </div>

                <div className="flex items-center mb-12 relative">
                    <div className="absolute top-[60px] left-[30px] h-[50px] border border-dashed border-white z-0" />

                    <div className={`relative w-[60px] h-[60px] inline-block rounded-full ${stage >= 2 ? 'bg-white' : 'bg-transparent global--2x-border-white'} `}>
                        <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-xl ${stage == 2 ? 'global--text-link' : 'global--text-white'}`}>2</span>
                    </div>

                    <span className="ml-10 font-body font-semibold text-base text-white">Cel poszukiwań</span>
                </div>

                <div className="flex items-center mb-12 relative">
                    <div className="absolute top-[60px] left-[30px] h-[50px] border border-dashed border-white z-0" />

                    <div className={`relative w-[60px] h-[60px] inline-block rounded-full ${stage >= 3 ? 'bg-white' : 'bg-transparent global--2x-border-white'} `}>
                        <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-xl ${stage == 3 ? 'global--text-link' : 'global--text-white'}`}>3</span>
                    </div>

                    <span className="ml-10 font-body font-semibold text-base text-white">Profil wspólpracy</span>
                </div>

                <div className="flex items-center mb-12 relative">
                    <div className="absolute top-[60px] left-[30px] h-[50px] border border-dashed border-white z-0" />

                    <div className={`relative w-[60px] h-[60px] inline-block rounded-full ${stage >= 4 ? 'bg-white' : 'bg-transparent global--2x-border-white'} `}>
                        <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-xl ${stage == 4 ? 'global--text-link' : 'global--text-white'}`}>4</span>
                    </div>

                    <span className="ml-10 font-body font-semibold text-base text-white">Kompetencje i umiejętności</span>
                </div>

                <div className="flex items-center mb-12 relative">
                    <div className="absolute top-[60px] left-[30px] h-[50px] border border-dashed border-white z-0" />

                    <div className={`relative w-[60px] h-[60px] inline-block rounded-full ${stage >= 5 ? 'bg-white' : 'bg-transparent global--2x-border-white'} `}>
                        <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-xl ${stage == 5 ? 'global--text-link' : 'global--text-white'}`}>5</span>
                    </div>

                    <span className="ml-10 font-body font-semibold text-base text-white">Typ i charakter projektu</span>
                </div>

                <div className="flex items-center mb-12 relative">
                    <div className={`relative w-[60px] h-[60px] inline-block rounded-full ${stage == 6 ? 'bg-white' : 'bg-transparent global--2x-border-white'} `}>
                        <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-xl ${stage == 6 ? 'global--text-link' : 'global--text-white'}`}>6</span>
                    </div>

                    <span className="ml-10 font-body font-semibold text-base text-white">Typ partnera</span>
                </div>
            </div>
        </div>
    );
}

export default  SearchCreatorSteps;