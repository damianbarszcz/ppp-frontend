import React from "react";
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Brand from "@/app/components/ui/Brand";
import {LoginProps} from "@/app/types/auth.types";

const LoginPanel : React.FC<LoginProps> = ({
    handleLogin,
    email,
    password,
    setEmail,
    setPassword,
    emailError,
    passwordError
}: LoginProps) => {

    return (
        <div className="h-full max-w-md m-auto flex flex-col justify-center">
            <Brand uiType="dark"/>

            <header className="text-center mt-10">
                <h2 className="text-3xl font-bold global--text-dark">Witaj ponownie</h2>
                <p className="global--text-silver mt-5 text-base font-regular">
                    Wprowadź swój adres e-mail i hasło, aby uzyskać dostęp do swojego konta
                </p>
            </header>

            <form onSubmit={handleLogin} className="mt-10">
                <div className="mb-10">
                    <Input
                        isLabel={true}
                        labelCaption="Adres e-mail"
                        name="email"
                        type="text"
                        placeholder="Wpisz swój adres e-mail"
                        uiType="light"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        validateError = {emailError}
                    />
                </div>

                <div className="mb-10">
                    <Input
                        isLabel={true}
                        labelCaption="Hasło"
                        name="password"
                        type="password"
                        placeholder="Wprowadź swoje hasło."
                        uiType="light"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        validateError = {passwordError}
                    />
                </div>

                <Button type="submit" uiType="dark" size="longSize">Zaloguj</Button>
            </form>

            <div className="text-center mt-10 flex justify-center">
                <p className="text-base global--text-dark">Nie masz konta?</p>
                <Link href="/auth/register" className="global--text-link ml-2 text-base font-semibold" target="_self">Zarejestruj się</Link>
            </div>
        </div>
    );
}

export default  LoginPanel;