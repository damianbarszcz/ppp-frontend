import React from "react";

interface MentorDashboardProps{
    handleLogout: (e:React.FormEvent) => void;
}

const MentorDashboard : React.FC<MentorDashboardProps> = ({
    handleLogout
} : MentorDashboardProps) => {
    return (
        <div className="flex h-[100vh] flex-col justify-center w-full text-center">
            <div>
                <a href="#" className="global--text-link ml-2 text-xl font-body"
                   onChange={(e) => handleLogout(e)} target="_self">
                    Wyloguj
                </a>
            </div>

            <div className="mt-20">
                <h1 className="font-heading text-5xl global--text-dark">Konto Mentor</h1>
            </div>
        </div>
    );
}

export default  MentorDashboard;