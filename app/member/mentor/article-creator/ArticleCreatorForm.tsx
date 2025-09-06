import React from "react";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";
import Button from "@/app/components/ui/Button";
import {ArticleFormProps} from '@/app/types/article.types';

const ArticleCreatorForm: React.FC<ArticleFormProps> = ({
  title,
  content,
  summary,
  setTitle,
  setSummary,
  setContent,
  thumbnailUrl,
  setThumbnailUrl,
  contentType,
  setContentType,
  createArticle,
  validationErrors
} : ArticleFormProps)=> {

    return (
        <section className="max-w-4xl mx-auto py-10 px-4">
            <div className="global--border-d-white rounded-md p-10">
                <header>
                    <h1 className="text-2xl font-bold mb-8 text-center text-app-dark">Co nowego dzisiaj tworzymy ?</h1>
                </header>

                <form onSubmit={createArticle}>
                    <div className="mb-10">
                        <Input
                            isLabel={true}
                            labelCaption="Tytuł"
                            name="title"
                            type="text"
                            placeholder="Podaj tytuł artykułu"
                            uiType="light"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            validateError={validationErrors.titleError}
                        />
                    </div>

                    <div className="mb-10">
                        <Input
                            isLabel={true}
                            labelCaption="Streszczenie"
                            name="summary"
                            type="text"
                            placeholder="Podaj krótkie streszczenie artykułu"
                            uiType="light"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            validateError={validationErrors.summaryError}
                        />
                    </div>

                    <div className="mb-10">
                        <Input
                            isLabel={true}
                            labelCaption="Url grafiki"
                            name="thumbnailUrl"
                            type="text"
                            placeholder="Link do grafiki artykułu np. https://example.com/image.jpg"
                            uiType="light"
                            value={thumbnailUrl}
                            onChange={(e) => setThumbnailUrl(e.target.value)}
                            validateError={validationErrors.thumbnailUrlError}
                        />
                    </div>

                    <div className="mb-10">
                        <Textarea
                            isLabel={true}
                            labelCaption="Treść artykułu"
                            name="content"
                            type="text"
                            placeholder="Napisz treść swojego artykułu..."
                            uiType="light"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            validateError={validationErrors.contentError}
                            rows={12}
                        />
                    </div>

                    <div className="mb-10">
                        <label className="text-base font-medium mb-4 block text-app-dark">Typ treści</label>

                        <div className="flex gap-6">
                            <div className={`${contentType === "free" ? "global--border-blue" : "global--border-d-white"} p-5 rounded-md cursor-pointer flex-1 h-28`}
                                 onClick={() => setContentType("free")}>
                                <div className="flex items-center mb-3">
                                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${contentType === "free" ? "border-blue-500" : "border-gray-400"}`}>
                                        {contentType === "free" && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                    </div>

                                    <h3 className="font-body text-lg font-medium global--text-dark">Bezpłatna</h3>
                                </div>

                                <p className="font-body text-sm text-app-silver mb-3">
                                    Treść dostępna dla wszystkich użytkowników
                                </p>
                            </div>

                            <div className={`${contentType === "paid" ? "global--border-blue" : "global--border-d-white"} p-5 rounded-md cursor-pointer flex-1 h-28`} onClick={() => setContentType("paid")}>
                                <div className="flex items-center mb-3">
                                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${contentType === "paid" ? "border-blue-500" : "border-gray-400"}`}>
                                        {contentType === "paid" && <div className="w-2 h-2 bg-app-blue rounded-full"></div>}
                                    </div>

                                    <h3 className="font-body text-lg font-medium text-app-dark">Płatna</h3>
                                </div>

                                <p className="font-body text-sm global--text-silver mb-3">
                                    Treść premium dla subskrybentów
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10">
                        <Button type="submit" uiType="primary" size="regularSize">Opublikuj</Button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default ArticleCreatorForm;