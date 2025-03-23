import React from "react";

interface ProspectorDashboardProps{
    handleLogout: (e:React.FormEvent) => void;
    user: User
}

interface User {
    id: number;
    email: string;
    account_type: string;
}

const ProspectorHome : React.FC<ProspectorDashboardProps> = ({
    handleLogout,
    user
} : ProspectorDashboardProps) => {
    return (
        <div className="flex h-[100vh] flex-col justify-center w-full text-center">
            <div>
                <a href="#" className="global--text-link ml-2 text-xl font-body"
                   onClick={(e) => handleLogout(e)} target="_self">
                    Wyloguj
                </a>
            </div>

            <div className="mt-20">
                <h1 className="font-heading text-2xl global--text-dark">Konto Poszukiwacz,  <br/> witaj {user.email}</h1>
            </div>
        </div>
    );
}

export default  ProspectorHome;