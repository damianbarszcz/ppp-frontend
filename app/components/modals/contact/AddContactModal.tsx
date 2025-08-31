import React  from "react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";

const AddContactModal: React.FC<{
    setContactModalOpen: (open: boolean) => void;
    handleAddContact: (e: React.FormEvent) => void;
    username: string;
    setUsername: (value: string) => void;
    getFieldError: (fieldName: string) => string;
}> = ({
    username,
    setUsername,
    setContactModalOpen,
    handleAddContact,
    getFieldError,
}) => {

    return (
        <div className="fixed inset-0 flex justify-center items-center  h-full w-full bg-black bg-opacity-60 overflow-y-auto">
            <div className="w-[650px] h-[400px] mx-auto p-12 shadow-lg rounded-md bg-white">
                <div className="flex justify-between">
                    <header>
                        <h2 className="font-semibold text-xl text-app-dark">Dodaj kontakt</h2>
                        <p className="mt-5 font-regular text-base text-app-silver">
                            Możesz zaprosić znajomego do swoich kontaktów podając jego nazwę użytkownika.
                        </p>
                    </header>

                    <div>
                       <span className="cursor-pointer" onClick={() => setContactModalOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                            </svg>
                       </span>
                    </div>
                </div>

                <div className="mt-10">
                    <form onSubmit={handleAddContact} className="mt-10 m-auto w-full">
                        <div className="mb-10">
                            <Input
                                isLabel={true}
                                labelCaption="Nazwa użytkownika"
                                name="title"
                                type="text"
                                placeholder="Podaj nazwę użytkownika"
                                uiType="light"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                validateError={getFieldError('username')}
                            />
                        </div>

                        <div className="mb-10 text-right">
                            <Button type="submit" uiType="primary" size="regularSize">Wyślij zaproszenie</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddContactModal;