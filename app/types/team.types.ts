import React from "react";

export interface TeamCreatorProps{
    handleCreateTeam: (e:React.FormEvent) => void;
    title:string;
    setTitle: (title:string) => void;
    description:string;
    setDescription: (description:string) => void;
    tags: string;
    setTags: (tags:string) => void;
    setModalOpen: (open: boolean) => void;
}

export interface Team {
    id: number;
    title: string;
    team_details: {
        description: string;
        tags: string[];
        team_avatar_color: string;
    };
}
