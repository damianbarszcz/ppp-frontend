import React from "react";

import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Brand from "@/app/components/ui/Brand";

interface LoginPanelProps{
    handleLogin: (e:React.FormEvent) => void;
    email: string;
    password: string;
    setEmail: (email:string) => void;
    setPassword: (password:string) => void;
}

const LoginPanel : React.FC<LoginPanelProps> = ({
    handleLogin,
    email,
    password,
    setEmail,
    setPassword,
}: LoginPanelProps) => {

    return (
        <div className="h-full max-w-md m-auto flex flex-col justify-center">
            <Brand uiType="dark"/>

            <header className="text-center mt-10">
                <h2 className="font-heading text-3xl font-semibold global--text-dark">Witaj ponownie</h2>
                <p className="global--text-silver mt-5 font-body text-base font-medium">Wprowadź swój adres e-mail i hasło, aby uzyskać dostęp do swojego konta</p>
            </header>

            <form onSubmit={handleLogin} className="mt-10">
                <Input
                    labelCaption="Adres e-mail"
                    name="email"
                    type="text"
                    placeholder="Wpisz swój adres e-mail"
                    uiType="light"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Input
                    labelCaption="Hasło"
                    name="password"
                    type="password"
                    placeholder="Wprowadź swoje hasło"
                    uiType="light"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" uiType="dark">Zaloguj</Button>
            </form>

            <div className="text-center mt-10 flex justify-center">
                <p className="text-base font-body global--text-dark">Nie masz konta?</p>
                <a href="/auth/register" className="global--text-link ml-2 text-base font-body" target="_self">Zarejestruj się</a>
            </div>
        </div>
    );
}

export default  LoginPanel;