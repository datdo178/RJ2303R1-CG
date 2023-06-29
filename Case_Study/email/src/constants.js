export const FOLDER_ICONS = {
    "1": "fa-inbox",
    "2": "fa-paper-plane",
    "3": "fa-pen-ruler",
    "4": "fa-trash-can",
    "5": "fa-star"
};

export const URLS = {
    USERS: 'http://demo3072656.mockable.io/user',
    FOLDERS: '%s/folder',
    EMAILS: '%s/folder/%s/email',
    EMAIL: '%s/folder/%s/email/%s'
}

export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const FOLDER_IDS = {
    DEFAULT: "1",  // INBOX
    SENT: "2",
    DRAFT: "3",
    DELETE: "4",
    STAR: "5"
}

export const MAX_SEARCH_RESULT_QUANTITY = 10;
