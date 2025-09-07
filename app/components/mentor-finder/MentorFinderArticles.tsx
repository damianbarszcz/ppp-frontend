import React from "react";
import {Mentor} from '@/app/types/user.types';
import {Article} from "@/app/types";

interface MentorProfileArticlesProps{
    mentor: Mentor,
    openArticleModal: (articles:Article) => void;
    articles: Article[];
}

const MentorFinderArticles : React.FC<MentorProfileArticlesProps> = ({
   mentor,
   articles,
   openArticleModal
} : MentorProfileArticlesProps) => {

    return (
        <section className="transform -translate-y-[60px]">
            <div className="w-full max-w-6xl mx-auto flex justify-between items-center">
                <div className="pl-5 pr-5 relative transform -translate-y-[50px]">
                    <span className="text-base font-bold  text-app-blue">Artykuły</span>
                    <div className="w-full absolute h-1  left-0 bg-app-blue transform translate-y-3"></div>
                </div>
            </div>

            <div className="w-full border-t border-gray-300">
                {articles.length > 0 ? (
                    <div className="max-w-6xl mx-auto px-4 mt-20">
                        <div className="grid grid-cols-3 gap-6">
                            {articles.map((article : any) => (
                                <div key={article.id} className="relative aspect-[4/5] bg-cover bg-center bg-gray-200 cursor-pointer rounded-md"
                                     style={{backgroundImage: article.thumbnail_url ? `url(${article.thumbnail_url})` : undefined}}
                                     onClick={() => openArticleModal(article)}>
                                    {article.content_type === 'paid' && (
                                        <div className="px-5 py-3 absolute top-3 right-3 bg-app-dark-gold  text-app-black  text-xs  rounded-full font-bold z-10">PREMIUM</div>
                                    )}
                                    <div className="absolute inset-0 p-4 flex flex-col rounded-md justify-end" style={{backgroundColor: `${mentor.profile.user_avatar_color}30`}}>
                                        <div className="p-4 rounded-md" style={{backgroundColor: `${mentor.profile.user_avatar_color}95`}}>
                                            <h3 className="text-app-black font-semibold text-xl mb-2 leading-tight">
                                                {article.title}
                                            </h3>
                                            <p className="text-app-black font-medium text-sm leading-relaxed line-clamp-4">
                                                {article.summary}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mt-10 mb-10 max-w-6xl mx-auto px-4">
                        <p className="text-center text-base text-app-dark font-semibold">Brak stworzonych artykułów</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default MentorFinderArticles;