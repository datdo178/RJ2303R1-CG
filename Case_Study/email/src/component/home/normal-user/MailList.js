import emptyPic from "../../../assets/images/cat-box.png";
import { FOLDER_IDS } from '../../../constants';

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { userSelector, folderSelector, mailSelector } from '../../../redux/selectors';
import generalSlice, { changeMailReadStateApi, deleteMailApi } from '../../../redux/generalSlice';

export default function MailList() {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const folder = useSelector(folderSelector);
    const mail = useSelector(mailSelector);

    const [checkedBoxes, setCheckedBoxes] = useState([]);
    const [isCheckedAll, setCheckedAll] = useState(false);
    const [selectedPage, setSelectedPage] = useState(1);

    let totalPages = useMemo(() => {
        return Math.ceil(mail.filterByFolder[folder.selectedId].length / mail.quantityPerPage);
    }, [folder.selectedId, mail.filterByFolder[folder.selectedId]]);

    let curPageMailList = useMemo(() => {
        const firstIndex = (selectedPage - 1) * mail.quantityPerPage;
        return [...mail.filterByFolder[folder.selectedId]].splice(firstIndex, mail.quantityPerPage);
    }, [folder.selectedId, selectedPage, mail.filterByFolder[folder.selectedId]]);

    useEffect(() => {
        dispatch(generalSlice.actions.setSelectedFolderId(params.folderId || folder.selectedId));
        setCheckedBoxes([]);
        setCheckedAll(false);
        setSelectedPage(1);
    }, [params.folderId]);

    function handleCheckedBoxed(id) {
        if (typeof id === 'string') {
            setCheckedBoxes(checkedBoxes.includes(id) ? checkedBoxes.filter(item => item !== id) : [...checkedBoxes, id]);
        } else {
            const isCheckingAll = checkedBoxes.length === curPageMailList.length;
            setCheckedBoxes(isCheckingAll ? [] : curPageMailList.map(mail => mail.id));
            setCheckedAll(!isCheckingAll);
        }
    }

    function deleteMails() {
        if (checkedBoxes.length === 0) {
            return;
        }

        dispatch(deleteMailApi({
            dataUrl: user.dataUrl,
            folderId: folder.selectedId,
            mailIds: checkedBoxes
        }));
    }
    function openEmail(mail) {
        if (folder.selectedId !== FOLDER_IDS.DRAFT) {
            navigate(`email/${mail.id}`);
            dispatch(changeMailReadStateApi({
                dataUrl: user.dataUrl,
                folderId: folder.selectedId,
                mailId: mail.id,
                isRead: true
            }));
            dispatch(generalSlice.actions.selectMail(mail));
        } else {
            dispatch(generalSlice.actions.setComposeMail(mail));
        }
    }
    function handleSelectedPage(direct) {
        const values = {
            "<<": 1,
            "<": selectedPage - 1,
            ">": selectedPage + 1,
            ">>": totalPages
        }
        if ((direct === "<" && selectedPage === 1) || (direct === ">" && selectedPage === totalPages)) {
            return
        }

        setSelectedPage(values[direct]);
    }

    return <div id="mail-list" className="block">
        <div className="d-flex justify-content-between ps-2 mb-3">
            <div className="d-flex justify-content-start align-items-center">
                <input type="checkbox" onChange={() => handleCheckedBoxed()} checked={isCheckedAll} />
                <button className="btn" onClick={() => deleteMails()} ><i className="fa-solid fa-trash-can fw-light"></i></button>
            </div>
            <div className="d-flex justify-content-start align-items-center">
                <div>{`Page ${totalPages === 0 ? 0 : selectedPage} of ${totalPages}`}</div>
                <ul className="pagination pagination-sm m-0 ps-3">
                    {["<<", "<", ">", ">>"].map(item => (
                        <li key={item} className="page-item"><button className="page-link text-black" onClick={() => handleSelectedPage(item)}>{item}</button></li>
                    ))}
                </ul>
            </div>
        </div>
        {curPageMailList.length < 1 ? <div className="d-flex flex-column justify-content-center align-items-center h-100">
            <img src={emptyPic} className="opacity-25 w-25" alt="Empty folder"/>
            <h1 className="opacity-25">Empty box</h1>
        </div> : ""}
        <div id="mail-list-table">
            <table className="table bg-white">
                <tbody>
                {curPageMailList.map(mailItem => (
                    <tr className="mail-line hover-meow" key={mailItem.id} onClick={() => openEmail(mailItem)}>
                        <td>
                            <input
                                type="checkbox"
                                checked={checkedBoxes.includes(mailItem.id)}
                                onClick={(e) => { e.stopPropagation(); handleCheckedBoxed(mailItem.id); }}
                                onChange={() => 1}
                            />
                        </td>
                        <td className={mailItem.isRead ? "" : "fw-bold"}>
                            {folder.selectedId === FOLDER_IDS.DRAFT || folder.selectedId === FOLDER_IDS.SENT ? mailItem.to : mailItem.from}
                        </td>
                        <td className="position-relative">
                            <div className={`text-nowrap overflow-hidden ${mailItem.isRead ? "" : "fw-bold"}`}>
                                {mailItem.isFlagged ? <i className="fa-solid fa-star fw-solid text-meow pe-1"></i> : ""}
                                {mailItem.title}
                            </div>
                            <div className="text-nowrap overflow-hidden fw-lighter">{mailItem.content.slice(0, 69)}...</div>
                        </td>
                        <td className="text-nowrap overflow-hidden fw-lighter">{new Date(mailItem.sentTime).toDateString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
}
