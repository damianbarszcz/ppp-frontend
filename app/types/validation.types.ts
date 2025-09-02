
export interface ValidationError {
    field: string;
    message: string;
}

export interface ArticleValidationFrontendError {
    titleError: string;
    summaryError: string;
    thumbnailUrlError: string;
    contentError: string;
}

export interface ProfileCreatorValidationFrontendError {
    aboutMeError: string;
}