import { FOLDER_ICONS } from "../../../constants";
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { folderSelector, composeSelector } from '../../../redux/selectors';
import generalSlice from '../../../redux/generalSlice';
import ComposeEmail from './Compose';

export default function SideBar() {
    const dispatch = useDispatch();
    const folder = useSelector(folderSelector);
    const compose = useSelector(composeSelector);

    function handleSelectFolder(folderId) {
        dispatch(generalSlice.actions.setSelectedFolderId(folderId));
    }
    function handleDisplayCompose() {
        dispatch(generalSlice.actions.changeComposeOpenState());
    }

    return <>
        <div id="side-bar" className="block w-100">
            <div className="d-flex justify-content-center">
                <button id="compose-email" className="px-3 my-3" onClick={() => handleDisplayCompose()}>
                    <i className="fa-solid fa-pen pe-1"></i>
                    <span>Compose</span>
                </button>
            </div>
            <div>
                <ul className="m-0 p-0 w-100">
                    {folder.list.map(item =>
                        <li
                            key={item.id}
                            className={`mail-folder nav-link fw-light hover-meow fs-4 p-3 ${item.id === folder.selectedId ? "mail-folder-selected" : ""}`}
                            onClick={() => handleSelectFolder(item.id)}
                        >
                            <Link className="nav-link" to={`/folder/${item.id}`}>
                                <i className={`fa-solid ${FOLDER_ICONS[item.id]} ps-3 pe-3`} />
                                <span>{item.name}</span>
                            </Link>
                        </li>)}
                </ul>
            </div>
        </div>
        {compose.isOpen ? <ComposeEmail handleDisplayCompose={handleDisplayCompose} /> : ""}
    </>
}
