import React from "react";
import styles from "@/app/member/prospector/search-creator/SearchCreatorSteps.module.css";

interface SearchCreatorStepsProps {
    stage: number;
}
const STEPS = [
    { id: 1, label: "Start" },
    { id: 2, label: "Cel współpracy" },
    { id: 3, label: "Preferencje komunikacyjne" },
    { id: 4, label: "Kompetencje i doświadczenie" },
    { id: 5, label: "Format współpracy" },
    { id: 6, label: "Dopasowanie i oczekiwania" }
] as const;

const SearchCreatorSteps : React.FC<SearchCreatorStepsProps> = (
    { stage }) => {

    const getStepClasses = (stepId: number) => {
        const isActive = stage === stepId;
        const isCompleted = stage > stepId;
        const isPending = stage < stepId;

        return {
            circle: `relative w-[60px] h-[60px] inline-block rounded-full ${
                isCompleted || isActive
                    ? 'bg-white'
                    : 'bg-transparent global--2x-border-white'
            }`,
            number: `absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-xl ${
                isActive
                    ? 'global--text-link'
                    : isPending
                        ? 'global--text-white'
                        : 'global--text-link'
            }`,
            label: "ml-10 font-body font-semibold text-base text-white"
        };
    };

    return (
        <div className={`flex justify-center content-center ${styles.banner} h-full`}>
            <div className="max-w-2xl mt-32">
                {STEPS.map((step, index) => {
                    const classes = getStepClasses(step.id);
                    const isLast = index === STEPS.length - 1;

                    return (
                        <div key={step.id} className="flex items-center mb-12 relative">
                            {!isLast && (
                                <div className="absolute top-[60px] left-[30px] h-[50px] border border-dashed border-white z-0" />
                            )}
                            <div className={classes.circle}>
                                <span className={classes.number}>{step.id}</span>
                            </div>
                            <span className={classes.label}>{step.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default  SearchCreatorSteps;