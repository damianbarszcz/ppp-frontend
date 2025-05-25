import React from "react";

interface User {
    id: number;
    email: string;
    account_type: string;
    name:string;
    surname:string;
    user_avatar_color: string;
}

interface MentorHomeProps{
    user: User
}

const MentorHome : React.FC<MentorHomeProps> = ({
    user
} : MentorHomeProps) => {
    return (
        <div className="flex h-[100vh] flex-col justify-center w-full text-center">
            <div className="mt-20">
                <h1 className="font-heading text-2xl global--text-dark">Konto Mentor, <br/> witaj {user.email}</h1>
            </div>
        </div>
    );
}

export default MentorHome;