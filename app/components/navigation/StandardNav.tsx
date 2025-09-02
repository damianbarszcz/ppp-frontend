import React from "react";
import {getInitials} from "@/app/components/utils/avatar";
import {isDarkColor} from "@/app/components/utils/color";
import { User } from '@/app/types/user.types';
import Input from "@/app/components/ui/Input";
import Link from "next/link";
import NavigationNotificationDropdown from "@/app/components/navigation/NavigationNotificationDropdown";
import NavigationAccountDropdown from "@/app/components/navigation/NavigationAccountDropdown";
import styles from "@/app/components/navigation/Navigation.module.css";

interface StandardNavProps{
    user: User;
    handleLogout: (e:React.FormEvent) => void;
    activeSection: string;
    notifyDropdownOpen: boolean;
    accountDropdownOpen: boolean;
    setNotifyDropdownOpen: (open: boolean) => void;
    setAccountDropdownOpen: (open: boolean) => void;
    hasMentorPlus: boolean;
    searchValue: string;
    setSearchValue: (value: string) => void;
    handleSearchSubmit: (e: React.FormEvent) => void;
}

function StandardNav({
   user,
   handleLogout,
   activeSection,
   notifyDropdownOpen,
   accountDropdownOpen,
   setAccountDropdownOpen,
   setNotifyDropdownOpen,
   hasMentorPlus,
   searchValue,
   setSearchValue,
   handleSearchSubmit,
}: StandardNavProps) {
    const initials = getInitials(user.profile.name, user.profile.surname);
    const isDark = isDarkColor(user.profile.user_avatar_color);
    const textColorClass = isDark ? 'text-white' : 'text-black';

    const handleNotificationClick = () => {
        setNotifyDropdownOpen(!notifyDropdownOpen);
        if (accountDropdownOpen) {
            setAccountDropdownOpen(false);
        }
    };

    const handleAccountClick = () => {
        setAccountDropdownOpen(!accountDropdownOpen);
        if (notifyDropdownOpen) {
            setNotifyDropdownOpen(false);
        }
    };

    return (
        <nav className="w-full pb-3 pt-3 border-b global--b-border-d-white">
            <div className="grid grid-cols-10 pr-10 pl-10">
                <div className="flex items-center col-span-8 ">
                    <div className="nav-brand w-5xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="72" height="26" viewBox="0 0 45 18" fill="none">
                            <path d="M0.208452 18V0.545454H7.09482C8.41868 0.545454 9.54652 0.798295 10.4783 1.30398C11.4102 1.80398 12.1204 2.5 12.609 3.39204C13.1033 4.27841 13.3505 5.30114 13.3505 6.46023C13.3505 7.61932 13.1005 8.64205 12.6005 9.52841C12.1005 10.4148 11.3761 11.1051 10.4272 11.5994C9.48402 12.0937 8.34197 12.3409 7.00107 12.3409H2.61186V9.38352H6.40447C7.1147 9.38352 7.69993 9.26136 8.16016 9.01705C8.62607 8.76705 8.97266 8.4233 9.19993 7.9858C9.43288 7.54261 9.54936 7.03409 9.54936 6.46023C9.54936 5.88068 9.43288 5.375 9.19993 4.94318C8.97266 4.50568 8.62607 4.16761 8.16016 3.92898C7.69425 3.68466 7.10334 3.5625 6.38743 3.5625H3.89879V18H0.208452ZM15.7475 18V0.545454H22.6339C23.9577 0.545454 25.0856 0.798295 26.0174 1.30398C26.9492 1.80398 27.6594 2.5 28.1481 3.39204C28.6424 4.27841 28.8896 5.30114 28.8896 6.46023C28.8896 7.61932 28.6396 8.64205 28.1396 9.52841C27.6396 10.4148 26.9151 11.1051 25.9663 11.5994C25.0231 12.0937 23.881 12.3409 22.5401 12.3409H18.1509V9.38352H21.9435C22.6538 9.38352 23.239 9.26136 23.6992 9.01705C24.1651 8.76705 24.5117 8.4233 24.739 7.9858C24.9719 7.54261 25.0884 7.03409 25.0884 6.46023C25.0884 5.88068 24.9719 5.375 24.739 4.94318C24.5117 4.50568 24.1651 4.16761 23.6992 3.92898C23.2333 3.68466 22.6424 3.5625 21.9265 3.5625H19.4379V18H15.7475ZM31.2866 18V0.545454H38.1729C39.4968 0.545454 40.6246 0.798295 41.5565 1.30398C42.4883 1.80398 43.1985 2.5 43.6871 3.39204C44.1815 4.27841 44.4286 5.30114 44.4286 6.46023C44.4286 7.61932 44.1786 8.64205 43.6786 9.52841C43.1786 10.4148 42.4542 11.1051 41.5053 11.5994C40.5621 12.0937 39.4201 12.3409 38.0792 12.3409H33.69V9.38352H37.4826C38.1928 9.38352 38.7781 9.26136 39.2383 9.01705C39.7042 8.76705 40.0508 8.4233 40.2781 7.9858C40.511 7.54261 40.6275 7.03409 40.6275 6.46023C40.6275 5.88068 40.511 5.375 40.2781 4.94318C40.0508 4.50568 39.7042 4.16761 39.2383 3.92898C38.7724 3.68466 38.1815 3.5625 37.4656 3.5625H34.9769V18H31.2866Z" fill="#474747"/>
                        </svg>
                    </div>

                    { (activeSection !== 'home' && user?.account_type === "P") &&
                        <div className="nav-search ml-8 w-[300px]">
                            <form onSubmit={handleSearchSubmit}  className="relative">
                                <Input isLabel={false} labelCaption=""
                                       name="nav-search"
                                       type="search"
                                       placeholder="Wyszukaj"
                                       uiType="light"
                                       value={searchValue}
                                       validateError=""
                                       onChange={(e) => setSearchValue(e.target.value)}
                                />

                                <button type="submit" className="absolute top-2.5 right-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5F6368">
                                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14
                                    83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                                    </svg>
                                </button>
                            </form>
                        </div> }

                    <div className="nav-menu ml-8">
                        {user?.account_type === "P" && (
                            <ul className="flex relative space-x-4 list-none">
                                <li className="relative pr-3 pl-3">
                                    <Link href="/member/prospector/home" className={`text-base font-semibold font-body 
                                ${activeSection === 'home' ? 'text-app-blue' : 'text-app-silver'}`} target="_self">
                                        Strona główna
                                    </Link>

                                    { activeSection === 'home' ? <span className={`${styles.active_link}`}></span> : '' }
                                </li>

                                <li className="relative pr-3 pl-3">
                                    <Link href="/member/prospector/contacts" className={`text-base font-semibold font-body 
                                ${activeSection === 'contacts' ? 'text-app-blue' : 'text-app-silver'}`} target="_self">
                                        Kontakty
                                    </Link>

                                    { activeSection === 'contacts' ? <span className={`${styles.active_link}`}></span> : '' }
                                </li>

                                <li className="relative pr-3 pl-3">
                                    <Link href="/member/prospector/teams" className={`text-base font-semibold font-body 
                                ${activeSection === 'teams' ? 'text-app-blue' : 'text-app-silver'}`} target="_self">
                                        Zespoły
                                    </Link>

                                    { activeSection === 'teams' ? <span className={`${styles.active_link}`}></span> : '' }
                                </li>
                            </ul> )}

                        {user?.account_type === "M" && (
                            <ul className="flex relative space-x-4 list-none">
                                <li className="relative pr-3 pl-3">
                                    <Link href="/member/mentor/home" className={`text-base font-semibold font-body 
                                    ${activeSection === 'home' ? 'text-app-blue' : 'text-app-silver'}`} target="_self">
                                        Strona główna
                                    </Link>

                                    { activeSection === 'home' ? <span className={`${styles.active_link}`}></span> : '' }
                                </li>

                                <li className="relative pr-3 pl-3">
                                    <Link href="/member/mentor/article-creator" className={`text-base font-semibold font-body 
                                    ${activeSection === 'article-creator' ? 'text-app-blue' : 'text-app-silver'}`} target="_self">
                                        Stwórz
                                    </Link>

                                    { activeSection === 'article-creator' ? <span className={`${styles.active_link}`}></span> : '' }
                                </li>

                                <li className="relative pr-3 pl-3">
                                    <Link href="/member/mentor/followers" className={`text-base font-semibold font-body 
                                    ${activeSection === 'followers' ? 'text-app-blue' : 'text-app-silver'}`} target="_self">
                                        Obserwatorzy
                                    </Link>

                                    { activeSection === 'followers' ? <span className={`${styles.active_link}`}></span> : '' }
                                </li>

                                <li className="relative pr-3 pl-3">
                                    <Link href="/member/mentor/mentor-profile" className={`text-base font-semibold font-body 
                                    ${activeSection === 'mentor-profile' ? 'text-app-blue' : 'text-app-silver'}`} target="_self">
                                        Profil mentora
                                    </Link>

                                    { activeSection === 'mentor-profile' ? <span className={`${styles.active_link}`}></span> : '' }
                                </li>
                            </ul> )}
                    </div>
                </div>

                <div className="flex justify-end items-center col-span-2">
                    { (user?.account_type === "M" && !hasMentorPlus) && (
                        <a href="/member/mentor/manage-plan" className="block p-2 mr-6 global--border-blue rounded-sm
                        text-sm font-body font-semibold global--text-link" target="_self">Uzyskaj Mentor+</a>
                    )}

                    {user?.account_type === "P" && (
                        <>
                        <a href="/member/prospector/search-creator" className="block p-2 mr-6 global--border-blue rounded-sm
                        text-sm font-body font-semibold global--text-link" target="_self">Kreator Poszukiwań</a>


                        <button type="button" onClick={handleNotificationClick} className="relative h-10 w-10 mr-3.5 rounded-full border border-app-dark">
                            <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-base`}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3C4043">
                                    <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0
                                     420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/>
                                </svg>
                            </span>
                        </button>
                        </>
                    )}

                    <button type="button" onClick={handleAccountClick} className="relative h-10 w-10 rounded-full" style={{ backgroundColor: user.profile.user_avatar_color }}>
                        <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-base ${textColorClass}`}>
                            {initials}
                        </span>
                    </button>
                </div>
            </div>

            {notifyDropdownOpen && (<NavigationNotificationDropdown />)}
            {accountDropdownOpen && (<NavigationAccountDropdown user={ user } handleLogout={handleLogout} />)}
        </nav>
    );
}

export default StandardNav;