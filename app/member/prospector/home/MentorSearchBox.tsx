import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_CONFIG } from '@/app/config/global';
import {isDarkColor} from "@/app/components/utils/color";
import {getInitials} from "@/app/components/utils/avatar";
import {User} from "@/app/types";
import Input from "@/app/components/ui/Input";

interface MentorSearchBoxProps {
    name: string;
}

const MentorSearchBox: React.FC<MentorSearchBoxProps> = ({ name }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (query.length >= 2) {
                searchMentors(query);
            } else if (query.length === 0) {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSelectedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchMentors = async (searchQuery: string) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${API_CONFIG.baseUrl}/api/search/mentors?q=${encodeURIComponent(searchQuery)}&limit=8`
            );
            setSuggestions(response.data.data);
        } catch (error) {
            console.error('Search error:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsOpen(true);
        setSelectedIndex(-1);
    };

    const handleInputFocus = () => {
        setIsOpen(true);
    };

    const handleMentorSelect = (username: string) => {
        router.push(`/member/prospector/mentor-search?username=${username}`);
        setIsOpen(false);
        setQuery('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                handleMentorSelect(suggestions[selectedIndex].profile.username);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setSelectedIndex(-1);
        }
    };

    return (
        <div className="relative w-full mx-auto" ref={dropdownRef}>
            <div className="relative">
                <Input isLabel={false} labelCaption=""
                       ref={inputRef}
                       name={name}
                       type="search"
                       placeholder="Znajdź swojego mentora..."
                       uiType="light"
                       value={query}
                       validateError=""
                       onChange={handleInputChange}
                       onFocus={handleInputFocus}
                       onKeyDown={handleKeyDown}
                       autoComplete="off"
                       autoCorrect="off"
                       autoCapitalize="off"
                       spellCheck={false}
                />

                { name == 'account-search' ? (
                <span className="absolute top-3 right-6">
                    <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#5F6368">
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14
                        83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                    </svg>
                </span> ) : (
                    <span className="absolute top-2.5 right-3">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5F6368">
                            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14
                             83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                        </svg>
                    </span>
                ) }

                {isLoading && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-app-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-app-dark">Wyniki wyszukiwania</span>
                    </div>

                    {suggestions.length > 0 ? (
                        <div className="py-2">
                            {suggestions.map((mentor, index) => {
                                const initials = getInitials(mentor.profile.name, mentor.profile.surname);
                                const isDark = isDarkColor(mentor.profile.user_avatar_color);
                                const textColorClass = isDark ? 'text-white' : 'text-black';

                                return(
                                    <div key={mentor.id} onClick={() => handleMentorSelect(mentor.profile.username)}
                                         className={`${ name == 'account-search' ? 'px-4 py-3 ' : 'px-4 py-1'} hover:bg-gray-50 cursor-pointer transition-colors ${selectedIndex === index ? 'bg-blue-50' : ''}`}>
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${textColorClass}`} style={{backgroundColor: mentor.profile.user_avatar_color}}>
                                                {initials}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2">
                                                    { name == 'account-search' ? (
                                                            <>
                                                                <span className="font-medium text-app-black">@{mentor.profile.username}</span>
                                                                <span className="text-sm text-app-dark">{mentor.profile.name} {mentor.profile.surname}</span>
                                                            </>
                                                        ): (
                                                            <div>
                                                                <span className="block font-medium text-sm text-app-black">@{mentor.profile.username}</span>
                                                                <span className="block ml-3 text-xs text-app-dark">{mentor.profile.name} {mentor.profile.surname}</span>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )})}
                        </div>
                    ) : query.length >= 2 ? (
                        <div className="px-4 py-8">
                            <p className="text-sm text-center text-app-dark">Brak wyników.</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default MentorSearchBox;