import React from "react";
import Textarea from "@/app/components/ui/Textarea";
import Button from "@/app/components/ui/Button";
import {ProspectorProfileFormProps} from '@/app/types/profile.types';

const ProfileCreatorForm: React.FC<ProspectorProfileFormProps> = ({
   aboutMe,
   setAboutMe,
   publishProspectorProfile,
   validationErrors
} : ProspectorProfileFormProps)=> {

    return (
        <section className="max-w-4xl mx-auto py-10 px-4">
            <div className="global--border-d-white rounded-md p-10">
                <header>
                    <h1 className="text-2xl font-bold mb-8 text-app-dark">Twój profil współpracownika</h1>
                    <p className="text-base font-regular mb-8 text-app-silver">
                        Pozwól się znaleźć dla potencjalnego partnera. Informacje które tutaj
                        przekażesz pozwolą na łatwiejsze zaproponowanie cię potencjalnemu partneru.
                    </p>
                </header>

                <form onSubmit={publishProspectorProfile}>
                    <div className="mb-10">
                        <Textarea
                            isLabel={true}
                            labelCaption="O mnie"
                            name="about-me"
                            type="text"
                            placeholder="Opisz swoje doświadczenie, pasje i cele zawodowe..."
                            uiType="light"
                            value={aboutMe}
                            onChange={(e) => setAboutMe(e.target.value)}
                            validateError={validationErrors.aboutMeError}
                            rows={12}
                        />
                    </div>

                    <div className="pt-10">
                        <Button type="submit" uiType="primary" size="regularSize">Opublikuj</Button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default ProfileCreatorForm;