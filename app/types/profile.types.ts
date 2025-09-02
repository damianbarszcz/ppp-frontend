import React from "react";
import {ProfileCreatorValidationFrontendError} from "@/app/types/validation.types";

export interface ProspectorProfileFormProps {
    aboutMe: string;
    setAboutMe: (value: string) => void;
    publishProspectorProfile: (e: React.FormEvent) => void;
    validationErrors:ProfileCreatorValidationFrontendError;
}
