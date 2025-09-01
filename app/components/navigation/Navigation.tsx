import React, {useState} from "react";
import {useRouter} from "next/navigation";
import { useSubscription } from '@/app/context/SubscriptionContext';
import { User,Team } from '@/app/types';
import TeamNav from "@/app/components/navigation/TeamNav";
import StandardNav from "@/app/components/navigation/StandardNav";

interface NavigationProps{
    activeSection: string,
    handleLogout: (e:React.FormEvent) => void;
    user: User;
    accountDropdownOpen: boolean;
    notifyDropdownOpen: boolean;
    setNotifyDropdownOpen: (e: boolean) => void;
    setAccountDropdownOpen: (e: boolean) => void;
    type: string,
    team?: Team;
}

function Navigation({
    activeSection,
    user,
    handleLogout,
    accountDropdownOpen,
    notifyDropdownOpen,
    setAccountDropdownOpen,
    setNotifyDropdownOpen,
    type,
    team
}: NavigationProps) {
    const { hasMentorPlus } = useSubscription();
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim() !== "") {
            router.push(`/member/prospector/mentor-search?username=${encodeURIComponent(searchValue.trim())}`);
        }
    };

    return (
        type === "standard" ? (
            <StandardNav
                user={user}
                handleLogout={handleLogout}
                activeSection={activeSection}
                accountDropdownOpen={accountDropdownOpen}
                notifyDropdownOpen={notifyDropdownOpen}
                setAccountDropdownOpen={setAccountDropdownOpen}
                setNotifyDropdownOpen={setNotifyDropdownOpen}
                hasMentorPlus={hasMentorPlus}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                handleSearchSubmit={handleSearchSubmit}
            />
        ) : (
            <TeamNav
                user={user}
                handleLogout={handleLogout}
                accountDropdownOpen={accountDropdownOpen}
                notifyDropdownOpen={notifyDropdownOpen}
                setAccountDropdownOpen={setAccountDropdownOpen}
                setNotifyDropdownOpen={setNotifyDropdownOpen}
                team={team}
            />
        )
    );
};

export default Navigation;