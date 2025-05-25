import React from "react";

interface SearchCreatorStage1Props {
    nextStage: () => void;
}

const SearchCreatorStage1: React.FC<SearchCreatorStage1Props> = ({
    nextStage }) => {
    return (
        <div className="h-full max-w-md m-auto flex flex-col justify-center">
            <div className="flex flex-col justify-between pt-12 pb-12 pr-10 pl-10 min-h-[650px] min-w-[550px] global--border-d-white rounded-md">
                <header>
                    <h1 className="font-body text-3xl font-bold global--text-dark">Cel Poszukiwań</h1>

                    <div className="mt-8 mr-24">
                        <p className="font-body text-base font-regular global--text-silver leading-[30px]">
                            Wybierz cel swoich poszukiwań
                        </p>
                    </div>
                </header>

                <div>
                    <form onSubmit={(e) => { e.preventDefault(); nextStage(); }}  className="relative">
                        <button type="submit" className="block pt-3 pb-3 pl-8 pr-8 global--border-blue rounded-3xl
                        text-sm font-body font-semibold global--text-link ml-auto">Dalej</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default  SearchCreatorStage1;