import React from "react";

export interface LoginProps{
    handleLogin: (e:React.FormEvent) => void;
    email: string;
    password: string;
    setEmail: (email:string) => void;
    setPassword: (password:string) => void;
    emailError: string;
    passwordError: string;
}