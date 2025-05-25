import React from "react";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";

interface ChannelCreatorProps{
    handleCreateTeam: (e:React.FormEvent) => void;
    title:string;
    setTitle: (title:string) => void;
    description:string;
    setDescription: (description:string) => void;
    tags: string;
    setTags: (tags:string) => void;
    setModalOpen: (open: boolean) => void;
}

const ChannelCreator: React.FC<ChannelCreatorProps> = ({
   handleCreateTeam,
    title,
    setTitle,
    description,
    setDescription,
    tags,
    setTags,
    setModalOpen
}: ChannelCreatorProps) => {
    return (
       <div className="fixed inset-0 flex justify-center items-center  h-full w-full bg-black bg-opacity-60 overflow-y-auto">
           <div className="w-[650px] h-[700px] mx-auto p-12 shadow-lg rounded-md bg-white">
               <div className="flex justify-between">
                   <div>
                       <h2 className="font-body font-medium text-lg">Podaj jakieś krótkie informacje na temat swojego zespołu</h2>
                   </div>

                   <div>
                       <span className="cursor-pointer" onClick={() => setModalOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                            </svg>
                       </span>
                   </div>
               </div>

               <div className="mt-10">
                   <form onSubmit={handleCreateTeam} className="mt-10 m-auto w-full">
                       <div className="mb-10">
                           <Input
                               isLabel={true}
                               labelCaption="Nazwa zespołu"
                               name="title"
                               type="text"
                               placeholder="Nadaj swojemu zespołowi nazwe"
                               uiType="light"
                               value={title}
                               onChange={(e) => setTitle(e.target.value)}
                               validateError = {''}
                           />
                       </div>

                       <div className="mb-10">
                           <Input
                               isLabel={true}
                               labelCaption="Tagi"
                               name="tags"
                               type="text"
                               placeholder="Podaj po przecinku tagi zespołu"
                               uiType="light"
                               value={tags}
                               onChange={(e) => setTags(e.target.value)}
                               validateError = {''}
                           />
                       </div>

                       <div className="mb-10">
                           <Textarea
                               isLabel={true}
                               labelCaption="Opis"
                               name="description"
                               type="text"
                               placeholder="Daj ludziom znać, czym zajmuje się ten zespół"
                               uiType="light"
                               value={description}
                               onChange={(e) => setDescription(e.target.value)}
                               validateError = {''}
                           />
                       </div>

                       <div className="mb-10">
                            <Button type="submit" uiType="dark">Utwórz zespół</Button>
                       </div>
                   </form>
               </div>
           </div>
       </div>
    );
}

export default  ChannelCreator;