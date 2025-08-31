import React from "react";
import {User} from "@/app/types";

interface SidenavProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    user : User;
}

const Sidenav: React.FC<SidenavProps> = ({activeSection,setActiveSection, user} : SidenavProps) => {

    return (
        <nav className="sidebar col-span-3 border-r min-h-[600px]">
            <ul className="relative">
                <li className="relative p-4 border-b global--b-border-d-white">
                    <button type="button"  className={`${activeSection == 'personal-data' ? 'global--text-link' : 'global--text-silver' } text-base font-medium`}  onClick={() => setActiveSection('personal-data')}>Dane osobowe</button>
                </li>
                { user.account_type === 'M'  &&
                <li className="relative p-4 border-b global--b-border-d-white">
                    <button type="button" className={`${activeSection == 'payments' ? 'global--text-link' : 'global--text-silver' } text-base font-medium`} onClick={() => setActiveSection('payments')}>Twój plan</button>
                </li> }
            </ul>
        </nav>
    );
}

export default Sidenav;