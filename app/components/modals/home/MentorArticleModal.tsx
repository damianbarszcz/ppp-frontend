import React  from "react";
import {Article} from "@/app/types/article.types";


const MentorArticleModal: React.FC<{
    selectedPost : Article;
    closeArticleModal: () => void;
}> = ({ selectedPost, closeArticleModal}) => {

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={() =>  closeArticleModal()}>
            <div className="bg-white rounded-lg w-full max-w-[1750px] max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="relative p-20">
                    <div className="max-w-[1024px] pb-5 m-auto">
                        <h2 className="text-2xl font-semibold mb-4 text-app-dark">{selectedPost.title}</h2>
                    </div>

                    <div className="pt-10 max-w-[1024px] m-auto text-center flex justify-center">
                        <img
                            src={selectedPost.thumbnail_url || '/placeholder.jpg'}
                            alt={selectedPost.title}
                            className="w-full max-w-[1024px] h-[650px] object-cover rounded-lg"
                        />
                    </div>

                    <button onClick={() =>  closeArticleModal()} className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-700 shadow-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="max-w-[850px] pb-10 m-auto px-10">
                    <div className="mb-8">
                        <div
                            className="text-xl font-body global--text-black  leading-relaxed prose prose-lg max-w-none
                                         prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg
                                         prose-p:mb-4 prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-1
                                         prose-strong:font-semibold prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded"
                            dangerouslySetInnerHTML={{ __html: selectedPost.summary }}
                        />
                    </div>

                    <div className="mb-8">
                        <div
                            className="text-lg font-body global--text-dark leading-relaxed prose prose-lg max-w-none
                                         prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg
                                         prose-p:mb-4 prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-1
                                         prose-strong:font-semibold prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded"
                            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorArticleModal;