
export interface ValidationError {
    field: string;
    message: string;
}

export interface LoginValidationError {
    emailError: string;
    passwordError: string;
}

export interface RegisterValidationError {
    nameError: string,
    surnameError: string,
    emailError: string,
    passwordError: string,
    accountTypeError: string,
}

export interface ArticleValidationFrontendError {
    titleError: string;
    summaryError: string;
    thumbnailUrlError: string;
    contentError: string;
}
