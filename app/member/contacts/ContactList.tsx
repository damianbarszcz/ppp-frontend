import React from "react";


const ContactList : React.FC = () => {
    return (
        <main>
            <section className="w-full">
                <div className="m-auto max-w-6xl pt-10">
                    <div className="grid grid-cols-10 table-item bg-red-500 w-full h-[50px]">
                        <div className="cell col-span-8">Imię i nazwisko</div>
                        <div className="cell col-span-2">Data dodania</div>
                    </div>

                    <div className="table-body">
                        <div className="table-item bg-blue-500 w-full h-[100px]">
                            <div>Damian Barszcz</div>
                        </div>

                        <div className="table-item bg-blue-500 w-full h-[100px]">

                        </div>

                        <div className="table-item bg-blue-500 w-full h-[100px]">

                        </div>

                        <div className="table-item bg-blue-500 w-full h-[100px]">

                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default  ContactList;