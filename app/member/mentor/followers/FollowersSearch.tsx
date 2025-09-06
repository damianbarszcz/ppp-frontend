import React, {useState} from "react";
import Input from "@/app/components/ui/Input";

interface FollowersSearchProps {
    followers: any[];
    onSearch: (filtered: any[]) => void;
}

const FollowersSearch: React.FC<FollowersSearchProps> = ({followers, onSearch}: FollowersSearchProps)  => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) : void => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = followers.filter(followerData => {
            const profile = followerData.follower.profile;
            const { username, name, surname } = profile;

            return (
                username.toLowerCase().includes(value) ||
                name.toLowerCase().includes(value) ||
                surname.toLowerCase().includes(value) ||
                `${name} ${surname}`.toLowerCase().includes(value)
            );
        });

        onSearch(filtered);
    };


    return (
        <div className="m-auto mt-5 w-full max-w-[650px]">
            <div>
                <h1 className="text-3xl mb-8 font-bold text-app-dark">Obserwatorzy ({followers.length})</h1>
            </div>

            <div className="relative">
                <Input
                    isLabel={false}
                    labelCaption=""
                    name="account-search"
                    type="search"
                    placeholder="Znajdź obserwującego"
                    uiType="light"
                    value={searchTerm}
                    validateError=""
                    onChange={handleSearchChange}
                />

                <button type="button" className="absolute top-3 right-6">
                    <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#5F6368">
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14
                                    83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default FollowersSearch;