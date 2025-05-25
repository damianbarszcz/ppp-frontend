import React from "react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";


const ContactActions : React.FC = () => {
    return (
        <section className="w-full">
            <div className="m-auto max-w-6xl">
                <header className="pt-10 w-full">
                    <h1 className="font-body text-3xl font-bold leading-[75px] global--text-dark">Twoje kontakty</h1>

                    <p className="font-body text-lg font-regular global--text-silver">Zarządzaj swoja listą kontaktów i dodawaj nowych.</p>
                </header>

                <div className="flex justify-between items-end pt-20 w-full">
                    <div className="">
                        <h2 className="font-body text-xl font-semibold leading-[65px] global--text-dark">Kontakty
                            <span className="global--text-dark"> 44 </span>
                        </h2>
                    </div>

                    <div className="flex justify-between">
                        <div className="">
                            <Input isLabel={false} labelCaption=""
                                   name="nav-search"
                                   type="search"
                                   placeholder="Wyszukaj kontakt"
                                   uiType="light"
                                   value=""
                                   validateError=""/>
                        </div>

                        <div className="mr-5">
                            <Button type="submit" uiType="dark">Dodaj kontakt</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default  ContactActions;