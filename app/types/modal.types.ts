import {User} from "@/app/types/user.types";

export interface PersonalData {
    user: User;
    savePersonalData: (data: any) => Promise<void>;
    modalType: 'name' | 'username' | 'biogram' | 'password' |  'mentor_subscribe_price' | null;
    isModalOpen: boolean;
    openModal: (type: 'name' | 'username' | 'biogram' | 'password' | 'mentor_subscribe_price') => void;
    closeModal: () => void;
}

