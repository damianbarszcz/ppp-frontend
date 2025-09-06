"use client";
import React from "react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import {RegisterPanelStep1Props} from "@/app/types";

const RegisterPanelStep1: React.FC<RegisterPanelStep1Props> = ({
     nextStep, updateFormData, formData,
     nameError,surnameError,emailError,passwordError } : RegisterPanelStep1Props) => {

    return (
        <div className="m-auto max-w-md flex flex-col">
            <form onSubmit={nextStep} className="mt-10 w-full">
                <div className="flex gap-4">
                    <div className="mb-10">
                        <Input
                            isLabel={true}
                            labelCaption="Imię"
                            name="name"
                            type="text"
                            placeholder="np. Jan"
                            uiType="dark"
                            value={formData.name}
                            onChange={(e) => updateFormData({ name: e.target.value })}
                            validateError = {nameError}
                        />
                    </div>

                    <div className="mb-10">
                        <Input
                            isLabel={true}
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
                </div>

                <div className="mb-10">
                    <Input
                        isLabel={true}
                        labelCaption="Adres e-mail"
                        name="email"
                        type="text"
                        placeholder="np. jannowak@gmail.com"
                        uiType="dark"
                        value={formData.email}
                        onChange={(e) => updateFormData({ email: e.target.value })}
                        validateError = {emailError}
                    />
                </div>

                <div className="mb-10">
                    <Input
                        isLabel={true}
                        labelCaption="Hasło"
                        name="password"
                        type="password"
                        placeholder="Wprowadź swoje hasło"
                        uiType="dark"
                        value={formData.password}
                        onChange={(e) => updateFormData({ password: e.target.value })}
                        validateError = {passwordError}
                    />
                </div>

                <div className="text-center">
                    <Button type="submit" uiType="light" size="fullSize">Kontynuuj</Button>
                </div>
            </form>
        </div>
    );
}

export default RegisterPanelStep1;