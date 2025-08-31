import React, { useState } from "react";
import { X } from "lucide-react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Textarea from "@/app/components/ui/Textarea";

interface PersonalDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    modalType: 'name' | 'username' | 'biogram'  | 'password' | null;
    currentUser: {
        name: string;
        surname: string;
        username?: string;
        biogram?: string;
    };
}

const PersonalDataModal: React.FC<PersonalDataModalProps> = ({
   isOpen,
   onClose,
   onSave,
   modalType,
   currentUser
} : PersonalDataModalProps) => {
    const [formData, setFormData] = useState(() => {
        switch (modalType) {
            case 'name':
                return {
                    name: currentUser?.name || '',
                    surname: currentUser?.surname || ''
                };
            case 'username':
                return {
                    username: currentUser?.username || ''
                };
            case 'biogram':
                return {
                    biogram: currentUser?.biogram || ''
                };
            case 'password':
                return {
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                };
            default:
                return {};
        }
    });

    const [serverError, setServerError] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (serverError) {
            setServerError('');
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const handleSubmit = async () => {
        setServerError('');

        try {
            await onSave(formData);
            onClose();
        } catch (error: any) {
            if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else {
                setServerError('Wystąpił błąd podczas zapisywania. Spróbuj ponownie.');
            }
        }
    };

    const getModalTitle = () => {
        switch (modalType) {
            case 'name':
                return 'Edytuj imię i nazwisko';
            case 'username':
                return 'Zmień nazwę użytkownika';
            case 'biogram':
                return 'Edytuj biogram';
            case 'password':
                return 'Zmień hasło';
            default:
                return 'Edytuj dane';
        }
    };

    const renderFormFields = () => {
        switch (modalType) {
            case 'name':
                return (
                    <>
                        <Input isLabel={true} labelCaption="Imię" name="name" type="text" placeholder="Wprowadź imię" uiType="light" value={formData.name} validateError="" onChange={handleInputChange}/>
                        <Input isLabel={true} labelCaption="Nazwisko" name="surname" type="text" placeholder="Wprowadź nazwisko" uiType="light" value={formData.surname} validateError="" onChange={handleInputChange} />
                    </>
                );

            case 'username':
                return (
                    <>
                        <Input isLabel={true} labelCaption="Nazwa użytkownika" name="username" type="text" placeholder="Wprowadź nazwę użytkownika" uiType="light" value={formData.username} validateError="" onChange={handleInputChange}/>

                        <p className="global--text-silver font-regular font-body text-sm mt-1">
                            Nazwa użytkownika może zawierać tylko litery, cyfry i podkreślenia.
                        </p>
                    </>
                );

            case 'biogram':
                return (
                    <>
                        <Textarea isLabel={true} labelCaption="Biogram" name="biogram" type="text" placeholder="Napisz coś o sobie..." uiType="light" value={formData.biogram} onChange={handleInputChange} validateError="" rows={4} />

                        <p className="global--text-silver font-regular font-body text-sm mt-1">
                            {formData.biogram?.length || 0}/150 znaków
                        </p>
                    </>
                );

            case 'password':
                return (
                    <>
                       <Input isLabel={true} labelCaption="Obecne hasło" name="currentPassword" type="password" placeholder="••••••••" uiType="light" value={formData.currentPassword} validateError="" onChange={handleInputChange} />
                       <Input isLabel={true} labelCaption="Nowe hasło" type="password" name="newPassword" placeholder="••••••••" uiType="light" value={formData.newPassword} validateError="" onChange={handleInputChange} />
                       <Input isLabel={true} labelCaption="Potwierdź nowe hasło" type="password" name="confirmPassword" placeholder="••••••••" uiType="light" value={formData.confirmPassword} validateError="" onChange={handleInputChange} />
                    </>
                );

            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-base font-semibold font-body global--text-black">
                        {getModalTitle()}
                    </h2>

                    <button onClick={handleCancel} className="p-1 hover:bg-gray-100 rounded">
                        <X size={20} />
                    </button>
                </div>

                {serverError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-800 text-sm">{serverError}</p>
                    </div>
                )}

                <div className="space-y-4">
                    {renderFormFields()}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" onClick={handleCancel} uiType="dark-outline" size="smallSize">Anuluj</Button>
                        <Button type="button" onClick={handleSubmit} uiType="primary" size="smallSize">Zapisz zmiany</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalDataModal;