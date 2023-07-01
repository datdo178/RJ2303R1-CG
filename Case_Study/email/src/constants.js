export const FOLDER_ICONS = {
    "1": "fa-inbox",
    "2": "fa-paper-plane",
    "3": "fa-pen-ruler",
    "4": "fa-trash-can",
    "5": "fa-star"
};

export const URLS = {
    CONFIG: 'https://647820fa362560649a2d3c20.mockapi.io/config/1',
    USERS: 'http://demo3072656.mockable.io/user',
    FOLDERS: '%s/folder',
    FOLDER: '%s/folder/%s',
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
export const SETTING_TABS = {
    0: { label: 'Folder', urlPrefix: 'folder-setting' },
    1: { label: 'Export Data', urlPrefix: 'export-data' },
    2: { label: 'Search', urlPrefix: 'search-setting'}
}
