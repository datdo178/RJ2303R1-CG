import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { FOLDER_IDS, URLS } from '../constants';
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
            list: []
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
        }
    },
    extraReducers: builder => {
        builder
            // loginApi
            .addCase(loginApi.pending, state => { state.isLoading = true })
            .addCase(loginApi.fulfilled, (state, action) => {
                state.user.email = action.payload.user.email;
                state.user.displayName = action.payload.user.displayName;
                state.user.dataUrl = action.payload.user.dataUrl;

                state.folder.list = action.payload.folderList;
                state.mail.list = action.payload.mailList;

                state.isLoading = false
            })
            .addCase(loginApi.rejected, state => { state.isLoading = false })
            // loginWithCookie
            .addCase(loginWithCookieApi.pending, state => { state.isLoading = true })
            .addCase(loginWithCookieApi.fulfilled, (state, action) => {
                state.isLoading = false

                state.user.email = action.payload.user.email;
                state.user.displayName = action.payload.user.displayName;
                state.user.dataUrl = action.payload.user.dataUrl;

                state.folder.list = action.payload.folderList;
                state.mail.list = action.payload.mailList;
            })
            .addCase(loginWithCookieApi.rejected, state => { state.isLoading = false })
            // switchFolder
            .addCase(switchFolderApi.pending, state => { state.isLoading = true })
            .addCase(switchFolderApi.fulfilled, (state, action) => {
                state.isLoading = false;
                state.folder.selectedId = action.payload.folderId;
                state.mail.list = action.payload.mailList;
            })
            .addCase(switchFolderApi.rejected, state => { state.isLoading = false })
            // changeMailReadState
            .addCase(changeMailReadStateApi.pending, state => { state.isLoading = true })
            .addCase(changeMailReadStateApi.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.mail.list.findIndex(item => item.id === action.payload.mailId);
                state.mail.list[index].isRead = action.payload.isRead;
            })
            .addCase(changeMailReadStateApi.rejected, state => { state.isLoading = false })
            // deleteMail
            .addCase(deleteMailApi.pending, state => { state.isLoading = true })
            .addCase(deleteMailApi.fulfilled, (state, action) => {
                state.isLoading = false;
                for (const id of action.payload) {
                    const index = state.mail.list.findIndex(mail => mail.id === id);
                    if (state.mail.list[index].id === state.mail.selected.id) {
                        state.mail.selected = {};
                    }
                    state.mail.list.splice(index, 1);
                }
            })
            .addCase(deleteMailApi.rejected, state => { state.isLoading = false })
            // flagMail
            .addCase(flagMailApi.pending, state => { state.isLoading = true })
            .addCase(flagMailApi.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.mail.list.findIndex(mail => mail.id === action.payload.mailId);
                state.mail.list[index].isFlagged = action.payload.isFlagged;

                if (state.mail.selected.id === action.payload.mailId) {
                    state.mail.selected.isFlagged = action.payload.isFlagged;
                }
            })
            .addCase(flagMailApi.rejected, state => { state.isLoading = false })
            // sendMail
            .addCase(sendMailApi.pending, state => { state.isLoading = true })
            .addCase(sendMailApi.fulfilled, (state, action) => {
                state.isLoading = false;
                state.compose = {
                    title: '',
                    toAddress: '',
                    content: ''
                };

                if (state.folder.selectedId === FOLDER_IDS.SENT) {
                    state.mail.list.push(action.payload);
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

                if (state.folder.selectedId === FOLDER_IDS.DRAFT) {
                    const index = state.mail.list.findIndex(mail => mail.id === action.payload)
                    if (index > -1) {
                        state.mail.list[index] = action.payload.data;
                    } else {
                        state.mail.list.push(action.payload.data);
                    }
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

        res = await axios.get(sprintf(URLS.EMAILS, loggedUser.dataUrl, FOLDER_IDS.DEFAULT));
        const mailList = res.data;

        return {
            user: loggedUser,
            folderList: folderList,
            mailList: mailList
        };
    }
)
export const loginWithCookieApi = createAsyncThunk(
    'general/loginWithCookie',
    async(cookieUser) => {
        let res = await axios.get(sprintf(URLS.FOLDERS, cookieUser.dataUrl));
        const folderList = res.data;

        res = await axios.get(sprintf(URLS.EMAILS, cookieUser.dataUrl, FOLDER_IDS.DEFAULT));
        const mailList = res.data;

        return {
            user: cookieUser,
            folderList: folderList,
            mailList: mailList
        }
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
        console.log(typeof folderId);
        if (mailIds.length === 0) {
            return [];
        }

        for (const id of mailIds) {
            if (folderId === FOLDER_IDS.DELETE) {
                await axios.delete(sprintf(URLS.EMAIL, dataUrl, folderId, id))
            } else {
                await axios.put(sprintf(URLS.EMAIL, dataUrl, folderId, id), { folderId: FOLDER_IDS.DELETE });
            }
        }

        return mailIds;
    }
)

export const changeMailReadStateApi = createAsyncThunk(
    'mail/changeReadState',
    async ({dataUrl, folderId, mailId, isRead}) => {
        await axios.put(sprintf(URLS.EMAIL, dataUrl, folderId, mailId), { isRead: isRead });
        return {
            mailId: mailId,
            isRead: isRead
        };
    }
)

export const flagMailApi = createAsyncThunk(
    'mail/flag',
    async ({dataUrl, folderId, mailId, isFlagged}) => {
        await axios.put(sprintf(URLS.EMAIL, dataUrl, folderId, mailId), { isFlagged: isFlagged });
        return {
            mailId: mailId,
            isFlagged: isFlagged
        }
    }
)

export const sendMailApi = createAsyncThunk(
    'mail/send',
    async({dataUrl, fromAddress, toAddress, title, content}) => {
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

        return res.data;
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
            data: res.data
        };
    }
)

export default generalSlice;
