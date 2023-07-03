import { useDispatch, useSelector } from 'react-redux';
import { configSelector, folderSelector, searchSelector, userSelector } from '../../../redux/selectors';
import generalSlice, { changeMailReadStateApi } from '../../../redux/generalSlice';
import { FOLDER_IDS } from '../../../constants';
import { useNavigate } from 'react-router-dom';

export function Search() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const search = useSelector(searchSelector);
    const user = useSelector(userSelector);
    const folder = useSelector(folderSelector);
    const config = useSelector(configSelector);

    function handleSearchKeywordChange(keyword) {
        dispatch(generalSlice.actions.search(keyword));
    }

    function openMail(mail) {
        console.log(mail.id);
        if (mail.folderId !== FOLDER_IDS.DRAFT) {
            navigate(`folder/${mail.folderId}/email/${mail.id}`);
            dispatch(changeMailReadStateApi({
                dataUrl: user.dataUrl,
                folderId: mail.folderId,
                mailId: mail.id,
                isRead: true
            }));
            dispatch(generalSlice.actions.selectMail(mail));
            handleSearchKeywordChange("");
        } else {
            navigate(`/folder/${mail.folderId}`);
            dispatch(generalSlice.actions.setComposeMail(mail));
            handleSearchKeywordChange("");
        }
    }

    return <div className="position-relative" style={{ width: "450px" }}>
        <input
            className={`form-control ${search.keyword ? "searching-state-input" : "rounded-pill"}`}
            onChange={e => handleSearchKeywordChange(e.target.value)}
            onFocus={e => handleSearchKeywordChange(e.target.value)}
        />

            {search.keyword ?
                <div id="search-result" className="bg-white text-dark hover-meow w-100 position-absolute">
                    <ul className="list-group">
                        <li key="count" className="list-group-item">
                            <b className="m-0 p-0">{`Found ${search.results.length} mail(s)`}</b>
                            <br/>
                            <span className="m-0 p-0 fw-lighter fs-5px">
                                {`Only search ${config.maxSearchResult} first matching results`}
                            </span>
                        </li>
                    </ul>
                    <ul className="list-group">
                        {search.results.map(item =>
                            <li
                                key={item.id}
                                className={`list-group-item hover-meow ${item.isRead ? '' : 'fw-bold'}`}
                                onClick={() => openMail(item)}
                            >
                                <span className="badge bg-personal">
                                    {folder.list.find(i => i.id === item.folderId).name}
                                </span>
                                {item.title.slice(0, 40)}{item.title.length > 40 ? "..." : ""}
                                <br/>
                                <span className="fw-lighter">{item.content.slice(0, 45)}{item.title.length > 45 ? "..." : ""}</span>
                            </li>
                        )}
                    </ul>
                </div> : ""
            }
    </div>

}
