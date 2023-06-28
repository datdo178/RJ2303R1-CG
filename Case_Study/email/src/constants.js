export const FOLDER_ICONS = {
    "Inbox": "fa-inbox",
    "Sent": "fa-paper-plane",
    "Star": "fa-star",
    "Draft": "fa-pen-ruler",
    "Trash": "fa-trash-can"
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
