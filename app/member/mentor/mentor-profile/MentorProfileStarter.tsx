import React from "react";
import Button from "@/app/components/ui/Button";

interface MentorProfileStarterProps {
    setIsExist: (isExist: boolean) => void;
    isExist: boolean;
}

const MentorProfileStarter: React.FC<MentorProfileStarterProps> = ({setIsExist,isExist} : MentorProfileStarterProps)=> {

    return (
        <section className="max-w-2xl mx-auto py-10 px-4">
            <div className="global--border-d-white rounded-md p-10">
                <header>
                    <h1 className="text-2xl font-bold mb-8 font-body global--text-dark">Profil Mentora</h1>

                    <p className="text-base mb-8 font-body font-regular global--text-silver">
                        Profil mentora jest miejscem w którym definiujesz charakter tworzonych przez siebie treści.
                        Na podstawie twojego profilu jesteśmy w stanie spozycjonować cię dla właściwej grupy użytkowników.
                    </p>

                    <p className="text-base mb-8 font-body font-regular global--text-silver">
                        Dzięki czemu twoje treści trafiają do tych użyutkowników którzy je oczekują.
                    </p>
                </header>

                <div className="mt-10 text-right">
                    <Button type="submit" uiType="primary" size="regularSize" onClick={() => setIsExist(!isExist)}>Stwórz profil</Button>
                </div>
            </div>
        </section>
    );
}

export default MentorProfileStarter;