import React from "react";
import Button from "@/app/components/ui/Button";
import {ArticleFormProps} from '@/app/types/article.types';

const MentorProfileForm: React.FC<ArticleFormProps> = ({
       createArticle,
                                                           validationErrors
} : ArticleFormProps)=> {

    return (
        <section className="max-w-2xl mx-auto py-10 px-4">
            <div className="global--border-d-white rounded-md p-10">
                <header>
                    <h1 className="text-2xl font-bold mb-8 font-body text-center global--text-dark">
                        Twój Profil Mentora
                    </h1>
                </header>

                <form onSubmit={createArticle}>
                    <div className="pt-10">
                        <Button type="submit" uiType="primary" size="regularSize">Zapisz</Button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default MentorProfileForm;