import React from "react";
import Button from "@/app/components/ui/Button";

interface SearchCreatorStage1Props {
    nextStage: () => void;
}

const SearchCreatorStage1: React.FC<SearchCreatorStage1Props> = ({ nextStage }) => {
    return (
        <div className="h-full max-w-md m-auto flex flex-col justify-center">
            <div className="flex flex-col justify-between pt-12 pb-12 pr-10 pl-10 min-h-[650px] min-w-[550px] global--border-d-white rounded-md">
                <header>
                    <h1 className="text-3xl font-bold text-app-dark">Kreator Poszukiwań</h1>

                    <div className="mt-8 mr-24">
                        <p className="text-base font-regular text-app-silver leading-[30px]">
                            Kreator pozwoli Ci na znalezienie mentora i partnera do zespołu.
                            W zalezności od twoich upodobań system zaproponuje możliwe najlepsze dopasowanie.
                        </p>
                    </div>
                </header>

                <div className="flex justify-end">
                    <Button type="button" uiType="primary" size="regularSize" onClick={nextStage}>Rozpocznij</Button>
                </div>
            </div>
        </div>
    );
}

export default  SearchCreatorStage1;