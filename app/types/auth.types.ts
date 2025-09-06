import React from "react";

export interface LoginProps{
    handleLogin: (e:React.FormEvent) => void;
    email: string;
    setEmail: (email:string) => void;
    password: string;
    setPassword: (password:string) => void;
    emailError: string;
    passwordError: string;
}

export interface RegisterPanelStep1Props {
    nextStep: (e: React.FormEvent) => void;
    updateFormData: (data: Partial<FormDataType>) => void;
    formData: FormDataType;
    nameError: string;
    surnameError: string;
    emailError: string;
    passwordError: string
}

export interface RegisterPanelStep2Props {
    nextStep: (e: React.FormEvent) => void;
    updateFormData: (data: Partial<FormDataType>) => void;
    formData: FormDataType;
    roleError: string
}

export interface RegisterPanelStep3Props{
    handleRegister: (e:React.FormEvent) => void;
    formData: FormDataType;
}

export interface FormDataType {
    name: string,
    surname: string,
    password:string,
    email: string,
    account_type: string
}