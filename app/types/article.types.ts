import React from "react";
import {ValidationError} from "@/app/types/validation.types";

export interface Article {
    title: string;
    content: string;
    summary:string;
    thumbnail_url: string;
    contentType: 'free' | 'paid';
}

export interface ArticleFormProps {
    title: string;
    setTitle: (value: string) => void;
    content: string;
    setContent: (value: string) => void;
    summary:string;
    setSummary: (value: string) => void;
    thumbnailUrl: string;
    setThumbnailUrl: (value: string) => void;
    contentType: 'free' | 'paid';
    setContentType: (value: 'free' | 'paid') => void;
    createArticle: (e: React.FormEvent) => void;
    validationErrors: ArticleValidationFrontendError;
}

export interface ArticleValidationFrontendError {
    titleError: string;
    summaryError: string;
    thumbnailUrlError: string;
    contentError: string;
}

export interface ArticleValidationError {
    field: string;
    message: string;
}