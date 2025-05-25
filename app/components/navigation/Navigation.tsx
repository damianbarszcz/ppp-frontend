import React from "react";
import Link from "next/link";
import styles from "./Navigation.module.css";
import Input from "@/app/components/ui/Input";
import { getInitials } from '@/app/components/utils/avatar';
import { isDarkColor } from '@/app/components/utils/color';


interface NavigationProps{
    activeSection: string,
    handleLogout: (e:React.FormEvent) => void;
    user: User,
    dropdownOpen: boolean
    setDropdownOpen: (e: boolean) => void;
    type: string
}

interface User {
    id: number;
    email: string;
    account_type: string;
    name:string;
    surname:string;
    user_avatar_color: string;
}

function Navigation({
    activeSection,
    user,
    handleLogout,
    dropdownOpen,
    setDropdownOpen,
    type
}: NavigationProps) {
    const initials = getInitials(user.name, user.surname);
    const isDark = isDarkColor(user.user_avatar_color);
    const textColorClass = isDark ? 'text-white' : 'text-black';

    return (

        type === "standard" ? (
        <nav className="w-full pb-3 pt-3 border-b global--b-border-d-white">
            <div className="grid grid-cols-10 pr-10 pl-10">
                <div className="flex items-center col-span-8 ">
                    <div className="nav-brand w-5xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="72" height="26" viewBox="0 0 45 18" fill="none">
                            <path d="M0.208452 18V0.545454H7.09482C8.41868 0.545454 9.54652 0.798295 10.4783 1.30398C11.4102 1.80398 12.1204 2.5 12.609 3.39204C13.1033 4.27841 13.3505 5.30114 13.3505 6.46023C13.3505 7.61932 13.1005 8.64205 12.6005 9.52841C12.1005 10.4148 11.3761 11.1051 10.4272 11.5994C9.48402 12.0937 8.34197 12.3409 7.00107 12.3409H2.61186V9.38352H6.40447C7.1147 9.38352 7.69993 9.26136 8.16016 9.01705C8.62607 8.76705 8.97266 8.4233 9.19993 7.9858C9.43288 7.54261 9.54936 7.03409 9.54936 6.46023C9.54936 5.88068 9.43288 5.375 9.19993 4.94318C8.97266 4.50568 8.62607 4.16761 8.16016 3.92898C7.69425 3.68466 7.10334 3.5625 6.38743 3.5625H3.89879V18H0.208452ZM15.7475 18V0.545454H22.6339C23.9577 0.545454 25.0856 0.798295 26.0174 1.30398C26.9492 1.80398 27.6594 2.5 28.1481 3.39204C28.6424 4.27841 28.8896 5.30114 28.8896 6.46023C28.8896 7.61932 28.6396 8.64205 28.1396 9.52841C27.6396 10.4148 26.9151 11.1051 25.9663 11.5994C25.0231 12.0937 23.881 12.3409 22.5401 12.3409H18.1509V9.38352H21.9435C22.6538 9.38352 23.239 9.26136 23.6992 9.01705C24.1651 8.76705 24.5117 8.4233 24.739 7.9858C24.9719 7.54261 25.0884 7.03409 25.0884 6.46023C25.0884 5.88068 24.9719 5.375 24.739 4.94318C24.5117 4.50568 24.1651 4.16761 23.6992 3.92898C23.2333 3.68466 22.6424 3.5625 21.9265 3.5625H19.4379V18H15.7475ZM31.2866 18V0.545454H38.1729C39.4968 0.545454 40.6246 0.798295 41.5565 1.30398C42.4883 1.80398 43.1985 2.5 43.6871 3.39204C44.1815 4.27841 44.4286 5.30114 44.4286 6.46023C44.4286 7.61932 44.1786 8.64205 43.6786 9.52841C43.1786 10.4148 42.4542 11.1051 41.5053 11.5994C40.5621 12.0937 39.4201 12.3409 38.0792 12.3409H33.69V9.38352H37.4826C38.1928 9.38352 38.7781 9.26136 39.2383 9.01705C39.7042 8.76705 40.0508 8.4233 40.2781 7.9858C40.511 7.54261 40.6275 7.03409 40.6275 6.46023C40.6275 5.88068 40.511 5.375 40.2781 4.94318C40.0508 4.50568 39.7042 4.16761 39.2383 3.92898C38.7724 3.68466 38.1815 3.5625 37.4656 3.5625H34.9769V18H31.2866Z" fill="#474747"/>
                        </svg>
                    </div>

                    {activeSection !== 'home' &&
                    <div className="nav-search ml-8 w-[300px]">
                        <form onSubmit={(e) => { e.preventDefault();  }} className="relative">
                            <Input isLabel={false} labelCaption=""
                                   name="nav-search"
                                   type="search"
                                   placeholder="Wyszukaj"
                                   uiType="light"
                                   value=""
                                   validateError=""
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
                        <ul className="flex relative space-x-4 list-none">
                            <li className="relative pr-3 pl-3">
                                <Link href="/member/home" className={`text-base font-semibold font-body 
                                ${activeSection === 'home' ? 'global--text-link' : 'global--text-silver'}`} target="_self">
                                    Strona główna
                                </Link>

                                { activeSection === 'home' ? <span className={`${styles.active_link}`}></span> : '' }
                            </li>

                            <li className="relative pr-3 pl-3">
                                <Link href="/member/contacts" className={`text-base font-semibold font-body 
                                ${activeSection === 'contacts' ? 'global--text-link' : 'global--text-silver'}`} target="_self">
                                    Kontakty
                                </Link>

                                { activeSection === 'contacts' ? <span className={`${styles.active_link}`}></span> : '' }
                            </li>

                            <li className="relative pr-3 pl-3">
                                <Link href="/member/channels" className={`text-base font-semibold font-body 
                                ${activeSection === 'channels' ? 'global--text-link' : 'global--text-silver'}`} target="_self">
                                    Zespoły
                                </Link>

                                { activeSection === 'channels' ? <span className={`${styles.active_link}`}></span> : '' }
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex justify-end items-center col-span-2">
                    <a href="/member/search-creator" className="block p-2 mr-6 global--border-blue rounded-sm
                    text-sm font-body font-semibold global--text-link" target="_self">Kreator Poszukiwań</a>

                    <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)} className="relative h-10 w-10 rounded-full" style={{ backgroundColor: user.user_avatar_color }}>
                        <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-base ${textColorClass}`}>
                            {initials}
                        </span>
                    </button>
                </div>
            </div>

            {dropdownOpen && (
            <div className="absolute right-10 z-10 mt-2 w-[256px] h-[214px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
               <div className="flex flex-col h-full">
                   <div className="p-5 w-full text-center">
                       <figure className="relative m-auto h-16 w-16 rounded-full" style={{ backgroundColor: user.user_avatar_color }}>
                            <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-2xl ${textColorClass}`}>
                                {initials}
                            </span>
                       </figure>

                       <div className="mt-4">
                           <div className="text-base font-body global--text-dark font-medium">{user.name} {user.surname}</div>
                           <div className="text-xs font-body global--text-silver">{user.email}</div>
                       </div>
                   </div>

                   <div className="w-full text-center">
                       <a href="#" className="inline-block pt-1.5 pb-1.5 pl-5 pr-5 global--border-dark rounded-3xl global--text-dark text-sm font-semibold  font-body"
                          onClick={(e) => handleLogout(e)} target="_self">
                           Wyloguj
                       </a>
                   </div>
               </div>
            </div> )}
        </nav> )
        : (
        <nav className="w-full pb-3 pt-3 bg-custom-blue">
           <div className="flex justify-between items-center pr-10 pl-10">
               <div className="flex items-center">
                   <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M5 16.6667L5.83333 13.3334H2.5L2.91667 11.6667H6.25L7.08333 8.33337H3.75L4.16667 6.66671H7.5L8.33333 3.33337H10L9.16667 6.66671H12.5L13.3333 3.33337H15L14.1667 6.66671H17.5L17.0833 8.33337H13.75L12.9167 11.6667H16.25L15.8333 13.3334H12.5L11.6667 16.6667H10L10.8333 13.3334H7.5L6.66667 16.6667H5ZM7.91667 11.6667H11.25L12.0833 8.33337H8.75L7.91667 11.6667Z" fill="#E3E3E3"/>
                       </svg>
                   </span>
                   <span className="flex font-body text-lg font-semibold text-white pl-2">
                       Robotica startup
                   </span>
               </div>

               <div>
                   <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)} className="relative h-10 w-10 rounded-full" style={{ backgroundColor: user.user_avatar_color }}>
                       <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-base ${textColorClass}`}>
                           {initials}
                       </span>
                   </button>
               </div>
           </div>

            {dropdownOpen && (
                <div className="absolute right-10 z-10 mt-2 w-[256px] h-[214px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="flex flex-col h-full">
                        <div className="p-5 w-full text-center">
                            <figure className="relative m-auto h-16 w-16 rounded-full" style={{ backgroundColor: user.user_avatar_color }}>
                                <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-body font-semibold text-2xl ${textColorClass}`}>
                                    {initials}
                                </span>
                            </figure>

                            <div className="mt-4">
                                <div className="text-base font-body global--text-dark font-medium">{user.name} {user.surname}</div>
                                <div className="text-xs font-body global--text-silver">{user.email}</div>
                            </div>
                        </div>

                        <div className="w-full text-center">
                            <a href="#" className="inline-block pt-1.5 pb-1.5 pl-5 pr-5 global--border-dark rounded-3xl global--text-dark text-sm font-semibold  font-body"
                               onClick={(e) => handleLogout(e)} target="_self">
                                Wyloguj
                            </a>
                        </div>
                    </div>
                </div> )}
            </nav>
        )
    );
};

export default Navigation;