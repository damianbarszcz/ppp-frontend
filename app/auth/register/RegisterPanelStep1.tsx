"use client";
import React from "react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";

interface RegisterPanelStep1Props {
    nextStep: () => void;
    updateFormData: (data: Partial<FormDataType>) => void;
    formData: FormDataType;
    nameError: string;
    surnameError: string;
    emailError: string;
    passwordError: string
}

interface FormDataType {
    name: string;
    surname: string;
    email: string;
    password: string;
}

const RegisterPanelStep1: React.FC<RegisterPanelStep1Props> = ({ nextStep, updateFormData, formData,
    nameError,surnameError,emailError,passwordError }) => {

    return (
        <div className="m-auto max-w-md flex flex-col">
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="mt-10 w-full">
                <div className="flex gap-4">
                    <Input
                        labelCaption="Imię"
                        name="name"
                        type="text"
                        placeholder="np. Jan"
                        uiType="dark"
                        value={formData.name}
                        onChange={(e) => updateFormData({ name: e.target.value })}
                        validateError = {nameError}
                    />

                    <Input
                        labelCaption="Nazwisko"
                        name="surname"
                        type="text"
                        placeholder="np. Kowalski"
                        uiType="dark"
                        value={formData.surname}
                        onChange={(e) => updateFormData({ surname: e.target.value })}
                        validateError = {surnameError}
                    />
                </div>
                <Input
                    labelCaption="Adres e-mail"
                    name="email"
                    type="text"
                    placeholder="np. jannowak@gmail.com"
                    uiType="dark"
                    value={formData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                    validateError = {emailError}
                />
                <Input
                    labelCaption="Hasło"
                    name="password"
                    type="password"
                    placeholder="Wprowadź swoje hasło"
                    uiType="dark"
                    value={formData.password}
                    onChange={(e) => updateFormData({ password: e.target.value })}
                    validateError = {passwordError}
                />
                <Button type="submit" uiType="light">Kontynuuj</Button>
            </form>
        </div>
    );
}

export default  RegisterPanelStep1;
