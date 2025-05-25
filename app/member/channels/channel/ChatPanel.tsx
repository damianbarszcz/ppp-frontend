import React from "react";
import Input from "@/app/components/ui/Input";

interface ChatPanelProps{
    handleMessage: (e:React.FormEvent) => void;
    message:string;
    setMessage: (message:string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
   message,
   handleMessage,
   setMessage,
}: ChatPanelProps) => {
    return (
        <section className="w-full h-full col-span-3 row-span-11 rounded-md border border-indigo-600">
            <div className="flex flex-col h-full pt-2 pb-2">
               <div className="flex justify-center flex-none pt-3 pb-3 border-b  border-b-blue-500">
                   <button type="button" className="block pt-1.5 pb-1.5 pl-6 pr-6 global--border-blue rounded-3xl
                        text-sm font-body font-semibold global--text-link">
                       Czat
                   </button>

                   <button type="button" className="block ml-3 pt-1.5 pb-1.5 pl-6 pr-6 global--border-blue rounded-3xl
                        text-sm font-body font-semibold global--text-link">
                       Uczestnicy (9)
                   </button>
               </div>

                <div className="flex-1 overflow-y-auto pt-5 pb-5 pl-3 pr-3">
                    <div className="flex mb-3 p-2 rounded-md bg-blue-500 text-sm">
                        <div></div>
                        <div>When you starting a company you are thinking on how to cut expenses.</div>
                    </div>
                    <div className="mb-3 p-2 rounded-md bg-blue-500 text-sm">When you starting a company you are thinking on how to cut expenses.</div>
                    <div className="mb-3 p-2 rounded-md bg-blue-500 text-sm">When you starting a company you are thinking on how to cut expenses.</div>
                </div>

                <div className="flex-none pt-2 pb-2 pl-3 pr-3">
                    <form className="relative" onSubmit={handleMessage}>
                        <Input
                            isLabel={false}
                            labelCaption=""
                            name="message"
                            type="text"
                            placeholder="Wyślij wiadomość..."
                            uiType="light"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            validateError = {''} />

                        <button className="absolute" type="button"></button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default  ChatPanel;