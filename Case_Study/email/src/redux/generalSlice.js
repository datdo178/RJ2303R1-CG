import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { FOLDER_IDS, MAX_SEARCH_RESULT_QUANTITY, URLS } from '../constants';
import { deleteCookie, setCookie } from '../assets/js/actions';
import { sprintf } from 'sprintf-js';

const generalSlice = createSlice({
    name:'general',
    initialState: {
        isLoading: false,
        loginError: '',
        user: {
            email: '',
            displayName: '',
            dataUrl: ''
        },
        folder: {
            selectedId: FOLDER_IDS.DEFAULT,
            list: []
        },
        mail: {
            quantityPerPage: 10,
            selected: {},
            list: [],
            filterByFolder: {}
        },
        compose: {
            isOpen: false,
            id: '',
            title: '',
            toAddress: '',
            content: ''
        },
        search: {
            keyword: '',
            results: []
        }
    },
    reducers: {
        logout: (state) => {
            deleteCookie();
            state.user = {
                email: '',
                displayName: '',
                dataUrl: ''
            }
            state.compose = {
                isOpen: false,
                id: '',
                title: '',
                toAddress: '',
                content: ''
            }
        },
        setLoadingState: (state, action) => {
            state.isLoading = action.payload;
        },
        setUser: (state, action) => {
            state.user.email = action.payload.email;
            state.user.displayName = action.payload.displayName;
            state.user.dataUrl = action.payload.dataUrl;
        },
        setSelectedFolderId: (state, action) => {
            state.folder.selectedId = action.payload;
        },
        filterMailByFolder: (state) => {
            state.mail.filterByFolder = {}
            for (const folder of state.folder.list) {
                state.mail.filterByFolder[folder.id] = folder.id !== FOLDER_IDS.STAR
                    ? state.mail.list.filter(mail => mail.id === folder.id)
                    : state.mail.list.filter(mail => mail.isFlagged)
            }
        },
        selectMail: (state, action) => {
            state.mail.selected = action.payload;
        },
        setComposeTitle: (state, action) => {
            state.compose.title = action.payload;
        },
        setComposeToAddress: (state, action) => {
            state.compose.toAddress = action.payload;
        },
        setComposeContent: (state, action) => {
            state.compose.content = action.payload;
        },
        setComposeMail: (state, action) => {
            state.compose.isOpen = true;
            state.compose.id = action.payload.id;
            state.compose.title = action.payload.title;
            state.compose.toAddress = action.payload.to.join('');
            state.compose.content = action.payload.content;
        },
        changeComposeOpenState: (state) => {
            state.compose.isOpen = !state.compose.isOpen;
        },
        search: (state, action) => {
            state.search.keyword = action.payload;
            const results = []

            for (const mail of state.mail.list) {
                if (
                    state.search.keyword &&
                    (mail.from.includes(state.search.keyword)
                    || mail.title.includes(state.search.keyword)
                    || mail.content.includes(state.search.keyword))
                ) {
                    results.push(mail);
                }

                if (results.length >= MAX_SEARCH_RESULT_QUANTITY) {
                    break;
                }
            }

            state.search.results = results;
        }
    },
    extraReducers: builder => {
        builder
            // loginApi
            .addCase(loginApi.pending, state => { state.isLoading = true })
            .addCase(loginApi.fulfilled, (state, action) => {
                state.user = action.payload.user
                state.folder.list = action.payload.folderList;
                state.mail.list = action.payload.mailList;
                state.mail.filterByFolder = action.payload.filterByFolder;
                state.isLoading = false
            })
            .addCase(loginApi.rejected, state => { state.isLoading = false })
            // loginWithCookie
            .addCase(loginWithCookieApi.pending, state => { state.isLoading = true })
            .addCase(loginWithCookieApi.fulfilled, (state, action) => {
                state.user = action.payload.user
                state.folder.list = action.payload.folderList;
                state.mail.list = action.payload.mailList;
                state.mail.filterByFolder = action.payload.filterByFolder;
                state.isLoading = false
            })
            .addCase(loginWithCookieApi.rejected, state => { state.isLoading = false })
            // // switchFolder
            // .addCase(switchFolderApi.pending, state => { state.isLoading = true })
            // .addCase(switchFolderApi.fulfilled, (state, action) => {
            //     state.isLoading = false;
            //     state.folder.selectedId = action.payload.folderId;
            //     state.mail.list = action.payload.mailList;
            // })
            // .addCase(switchFolderApi.rejected, state => { state.isLoading = false })
            // changeMailReadState
            .addCase(changeMailReadStateApi.pending, state => { state.isLoading = true })
            .addCase(changeMailReadStateApi.fulfilled, (state, action) => {
                let index = state.mail.list.findIndex(item => item.id === action.payload.mail.id);
                state.mail.list[index] = action.payload.mail;

                index = state.mail.filterByFolder[action.payload.folderId].findIndex(item => item.id === action.payload.mail.id);
                state.mail.filterByFolder[action.payload.folderId][index] = action.payload.mail;

                state.isLoading = false;
            })
            .addCase(changeMailReadStateApi.rejected, state => { state.isLoading = false })
            // deleteMail
            .addCase(deleteMailApi.pending, state => { state.isLoading = true })
            .addCase(deleteMailApi.fulfilled, (state, action) => {
                if (action.payload.mailIds.includes(state.mail.selected.id)) {
                    state.mail.selected = {};
                }

                for (const id of action.payload.mailIds) {
                    state.mail.list = state.mail.list.filter(item => item.id !== id);

                    const removedMail = state.mail.filterByFolder[action.payload.folderId].find(item => item.id === id);
                    removedMail.isFlagged = false;
                    state.mail.filterByFolder[action.payload.folderId] = state.mail.filterByFolder[action.payload.folderId].filter(item => item.id !== id);

                    if (action.payload.folderId !== FOLDER_IDS.DELETE) {
                        const index = state.mail.filterByFolder[FOLDER_IDS.DELETE].findIndex(item => item.id > removedMail.id);
                        state.mail.filterByFolder[FOLDER_IDS.DELETE].splice(index, 0, removedMail);
                    }
                }

                state.isLoading = false;
            })
            .addCase(deleteMailApi.rejected, state => { state.isLoading = false })
            // flagMail
            .addCase(flagMailApi.pending, state => { state.isLoading = true })
            .addCase(flagMailApi.fulfilled, (state, action) => {
                const indexList = state.mail.list.findIndex(item => item.id === action.payload.mailId);
                state.mail.list[indexList].isFlagged = action.payload.isFlagged;

                const indexFilterList = state.mail.filterByFolder[action.payload.folderId].findIndex(item => item.id === action.payload.mailId);
                state.mail.filterByFolder[action.payload.folderId][indexFilterList].isFlagged = action.payload.isFlagged;

                const indexStar = state.mail.filterByFolder[FOLDER_IDS.STAR].findIndex(item => item.id === action.payload.mailId);
                if (indexStar === -1 && action.payload.isFlagged) {
                    const indexToInsert = state.mail.filterByFolder[FOLDER_IDS.STAR].findIndex(item => item.id > action.payload.mailId);
                    state.mail.filterByFolder[FOLDER_IDS.STAR].splice(indexToInsert, 0, state.mail.list[indexList]);
                } else if (indexStar > -1 && !action.payload.isFlagged) {
                    state.mail.filterByFolder[FOLDER_IDS.STAR].splice(indexStar, 1);
                }

                if (state.mail.selected.id === action.payload.mailId) {
                    state.mail.selected.isFlagged = action.payload.isFlagged;
                }

                state.isLoading = false;
            })
            .addCase(flagMailApi.rejected, state => { state.isLoading = false })
            // sendMail
            .addCase(sendMailApi.pending, state => { state.isLoading = true })
            .addCase(sendMailApi.fulfilled, (state, action) => {
                state.isLoading = false;
                state.compose = {
                    isOpen: false,
                    id: '',
                    title: '',
                    toAddress: '',
                    content: ''
                };

                state.mail.list.push(action.payload.mail);
                state.mail.filterByFolder[FOLDER_IDS.SENT].push(action.payload.mail);

                if (action.payload.id) {
                    const index = state.mail.filterByFolder[FOLDER_IDS.DRAFT].findIndex(item => item.id === action.payload.id);
                    state.mail.filterByFolder[FOLDER_IDS.DRAFT].splice(index, 1);
                }
            })
            .addCase(sendMailApi.rejected, state => { state.isLoading = false })
            // saveDraftMail
            .addCase(saveMailDraftApi.pending, state => { state.isLoading = false })
            .addCase(saveMailDraftApi.fulfilled, (state, action) => {
                state.isLoading = false;
                state.compose = {
                    id: '',
                    title: '',
                    toAddress: '',
                    content: ''
                };

                if (!action.payload.id) {
                    state.mail.list.push(action.payload.mail)
                    state.mail.filterByFolder[FOLDER_IDS.DRAFT].push(action.payload.mail);
                } else {
                    const indexList = state.mail.list.findIndex(item => item.id === action.payload.mail.id);
                    state.mail.list[indexList] = action.payload.mail;

                    const indexFilterList = state.mail.filterByFolder[FOLDER_IDS.DRAFT].findIndex(item => item.id === action.payload.mail.id);
                    state.mail.filterByFolder[FOLDER_IDS.DRAFT][indexFilterList] = action.payload.mail;
                }
            })
            .addCase(saveMailDraftApi.rejected, state => { state.isLoading = false })
    }
})

export const loginApi = createAsyncThunk(
    'general/login',
    async (credentials) => {
        let res = await axios.get(URLS.USERS);
        const loggedUser = res.data.find(user => user.email === credentials.email);
        // const hash = bcrypt.hashSync(credentials.password,"$2a$10$m4NDunPOgN.5EXbQQfSqKO");
        delete loggedUser.password;
        setCookie("user", JSON.stringify(loggedUser));

        res = await axios.get(sprintf(URLS.FOLDERS, loggedUser.dataUrl));
        const folderList = res.data;
        const mailList = [];
        const filterByFolder = {};

        for (const folder of folderList) {
            if (folder.id !== FOLDER_IDS.STAR) {
                const res = await axios.get(sprintf(URLS.EMAILS, loggedUser.dataUrl, folder.id));
                filterByFolder[folder.id] = res.data;
                mailList.push(...res.data);
            }
        }

        filterByFolder[FOLDER_IDS.STAR] = mailList.filter(mail => mail.isFlagged === true);

        return {
            user: loggedUser,
            folderList: folderList,
            mailList: mailList,
            filterByFolder: filterByFolder
        };
    }
)
export const loginWithCookieApi = createAsyncThunk(
    'general/loginWithCookie',
    async(cookieUser) => {
        let res = await axios.get(sprintf(URLS.FOLDERS, cookieUser.dataUrl));
        const folderList = res.data;
        const mailList = [];
        const filterByFolder = {};

        for (const folder of folderList) {
            if (folder.id !== FOLDER_IDS.STAR) {
                const res = await axios.get(sprintf(URLS.EMAILS, cookieUser.dataUrl, folder.id));
                filterByFolder[folder.id] = res.data;
                mailList.push(...res.data);
            }
        }

        filterByFolder[FOLDER_IDS.STAR] = mailList.filter(mail => mail.isFlagged === true);

        return {
            user: cookieUser,
            folderList: folderList,
            mailList: mailList,
            filterByFolder: filterByFolder
        };
    }
)

export const getFolderListApi = createAsyncThunk(
    'folder/getList',
    async (dataUrl) => {
        if (dataUrl) {
            const res = await axios.get(sprintf(URLS.FOLDERS, dataUrl));
            return res.data;
        } else {
            return [];
        }
    }
)

export const switchFolderApi = createAsyncThunk(
    'folder/switch',
    async ({ dataUrl, folderId, folderList }) => {
        let mailList = [];

        if (folderId === FOLDER_IDS.STAR) {
            for (const folder of folderList) {
                const res = await axios.get(sprintf(URLS.EMAILS, dataUrl, folder.id));
                mailList.push(...res.data.filter(mail => mail.isFlagged));
            }
        } else {
            const res = await axios.get(sprintf(URLS.EMAILS, dataUrl, folderId));
            mailList = res.data;
        }

        return {
            folderId: folderId,
            mailList: mailList
        }
    }
)

export const getMailListApi = createAsyncThunk(
    'mail/getList',
    async (dataUrl, folderId) => {
        if (dataUrl && folderId) {
            const res = await axios.get(sprintf(URLS.EMAILS, dataUrl, folderId));
        }
    }
)

export const deleteMailApi = createAsyncThunk(
    'mail/delete',
    async({dataUrl, folderId, mailIds}) => {
        for (const id of mailIds) {
            if (folderId === FOLDER_IDS.DELETE) {
                await axios.delete(sprintf(URLS.EMAIL, dataUrl, folderId, id))
            } else {
                await axios.put(sprintf(URLS.EMAIL, dataUrl, folderId, id), { folderId: FOLDER_IDS.DELETE, isFlagged: false });
            }
        }

        return {
            folderId: folderId,
            mailIds: mailIds
        };
    }
)

export const changeMailReadStateApi = createAsyncThunk(
    'mail/changeReadState',
    async ({dataUrl, folderId, mailId, isRead}) => {
        const res = await axios.put(sprintf(URLS.EMAIL, dataUrl, folderId, mailId), { isRead: isRead });

        return {
            folderId: folderId,
            mail: res.data
        };
    }
)

export const flagMailApi = createAsyncThunk(
    'mail/flag',
    async ({dataUrl, folderId, mailId, isFlagged}) => {
        await axios.put(sprintf(URLS.EMAIL, dataUrl, folderId, mailId), { isFlagged: isFlagged });
        return {
            folderId: folderId,
            mailId: mailId,
            isFlagged: isFlagged
        }
    }
)

export const sendMailApi = createAsyncThunk(
    'mail/send',
    async({dataUrl, fromAddress, toAddress, title, content, id}) => {
        const data = {
            sentTime: new Date().toISOString(),
            from: fromAddress,
            to: [toAddress],
            title: title,
            content: content,
            isRead: true,
            isFlagged: false,
            folderId: FOLDER_IDS.SENT
        }
        const res = await axios.post(sprintf(URLS.EMAILS, dataUrl, FOLDER_IDS.SENT), data);

        return {
            id: id,
            mail: res.data
        };
    }
)

export const saveMailDraftApi = createAsyncThunk(
    'mail/saveDraft',
    async({dataUrl, fromAddress, toAddress, title, content, id}) => {
        const data = {
            sentTime: new Date().toISOString(),
            from: fromAddress,
            to: [toAddress],
            title: title,
            content: content,
            isRead: true,
            isFlagged: false,
            folderId: FOLDER_IDS.DRAFT
        }
        let res;
        if (!id) {
            res = await axios.post(sprintf(URLS.EMAILS, dataUrl, FOLDER_IDS.DRAFT), data);
        } else {
            res = await axios.put(sprintf(URLS.EMAIL, dataUrl, FOLDER_IDS.DRAFT, id), data);
        }

        return {
            id: id,
            mail: res.data
        };
    }
)

export default generalSlice;
