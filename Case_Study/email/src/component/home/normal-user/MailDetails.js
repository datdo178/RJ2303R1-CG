import avatar from "../../../assets/images/cat.png";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { folderSelector, mailSelector, userSelector } from '../../../redux/selectors';
import { changeMailReadStateApi, deleteMailApi, flagMailApi } from '../../../redux/generalSlice';

export default function MailDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [readState, setReadState] = useState(false);
    const user = useSelector(userSelector);
    const folder = useSelector(folderSelector);
    const mail = useSelector(mailSelector);

    function backToMailList() {
        navigate(`/folder/${mail.selected.folderId}`);
    }
    function deleteMail() {
        const folderId = mail.selected.folderId;
        dispatch(deleteMailApi({
            dataUrl: user.dataUrl,
            folderId: folder.selectedId,
            mailIds: [mail.selected.id]
        }));
        navigate(`/folder/${folderId}`);
    }
    function flagMail() {
        dispatch(flagMailApi({
            dataUrl: user.dataUrl,
            folderId: folder.selectedId,
            mailId: mail.selected.id,
            isFlagged: !mail.selected.isFlagged
        }));
    }
    function changeReadState() {
        setReadState(!readState);
        dispatch(changeMailReadStateApi({
            dataUrl: user.dataUrl,
            folderId: folder.selectedId,
            mailId: mail.selected.id,
            isRead: readState
        }));
    }

    return <div id="mail-details" className="block">
        {!mail.selected.id ? "" : <>
            <div id="mail-actions" className="ms-3 py-3">
                <button className="btn" onClick={() => backToMailList()}>
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <button className="btn" onClick={() => deleteMail()}>
                    <i className="fa-solid fa-trash-can fw-light"></i>
                </button>
                <button className="btn" onClick={() => flagMail()}>
                    <i className={`fa-solid fa-star ${mail.selected.isFlagged ? "fw-solid text-meow" : "fw-light"}`}></i>
                </button>
                <button className="btn" onClick={() => changeReadState()}>
                    <i className={`${readState ? "fa-solid" : "fa-regular"} fa-envelope`}></i>
                </button>
                <button className="btn"><i className="fa-solid fa-reply"></i></button>
                <button className="btn"><i className="fa-solid fa-right-to-bracket"></i></button>
            </div>
            <div className="px-4">
                <div className="d-flex align-items-center">
                    <img src={avatar} alt="avatar"/>
                    <span className="ps-2">
                        <b>From: {mail.selected.from}</b>
                        <br />
                        <b>To: {mail.selected.to}</b>
                        <br />
                        Sent Time: {new Date(mail.selected.sentTime).toDateString()}
                    </span>
                </div>
                <h2 className="text-center text-meow ps-5">{mail.selected.title}</h2>
                <p className="fs-4">Hello!</p>
                <p className="fs-4 text-justify">{mail.selected.content}</p>
                <p className="fs-4 float-end">Thanks!</p>
            </div>
        </>}
    </div >
    // const { userInfo, emails, actions } = props;
    // const params = useParams();

    //
    // function changeReadState(id) {
    //     actions.handleLoading(true);
    //
    //     axios.put(sprintf(URLS.EMAIL, userInfo.dataUrl, params.folderId, id))
    //         .then(res => {
    //             const index = emails.findIndex(email => email.id === id);
    //             emails[index].isRead = false;
    //             actions.handleLoading(false);
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             actions.handleLoading(false);
    //         })
    // }
    //
}
