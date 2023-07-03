import { useDispatch, useSelector } from 'react-redux';
import { folderSelector, userSelector } from '../../../redux/selectors';
import { FOLDER_ICONS } from '../../../constants';
import { useState } from 'react';
import { updateFolderApi } from '../../../redux/generalSlice';

export function FolderSetting() {
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const folder = useSelector(folderSelector);
    const [selectedFolder, setSelectedFolder] = useState([]);
    const [folderList, setFolderList] = useState([...folder.list]);

    function selectFolder(id) {
        const temp = [...selectedFolder];
        temp.push(id);
        setSelectedFolder(temp);
    }
    function unselectFolder(id) {
        const temp = [...selectedFolder];
        const index1 = temp.findIndex(item => item === id);
        temp.splice(index1, 1)
        setSelectedFolder(temp);

        const temp2 = JSON.parse(JSON.stringify(folderList));
        const index2 = folder.list.findIndex(item => item.id === id);
        temp2[index2].name = folder.list[index2].name;
        setFolderList(temp2);
    }
    function changeFolderName(value, id) {
        const updatedList = JSON.parse(JSON.stringify(folderList));
        const index = updatedList.findIndex(item => item.id === id);

        updatedList[index].name = value;
        setFolderList(updatedList);
    }
    function save() {
        const changedFolderList = [];
        for (const index in folderList) {
            if (folderList[index].name !== folder.list[index].name) {
                changedFolderList.push(folderList[index]);
            }
        }

        dispatch(updateFolderApi({
            dataUrl: user.dataUrl,
            folderList: changedFolderList
        }));
        setSelectedFolder([]);
    }

    return <div id="folder-setting" className="block">
        <div className="p-3">
            <div className="fs-1 fw-light border-bottom text-center fw-bold py-3 mb-3">Folder Setting</div>
            <ul className="list-group">
                {folderList.map(item => <div key={item.id}>
                    {selectedFolder.includes(item.id)
                        ? <li key={item.id} className="list-group-item">
                            <i className={`fa-solid ${FOLDER_ICONS[item.id]} text-meow ps-3 pe-3`} />
                            <input key={item.id} value={item.name} onChange={e => changeFolderName(e.target.value, item.id)}/>
                            <button className="btn" onClick={() => unselectFolder(item.id)}><i className="fa-solid fa-circle-xmark text-meow"></i></button>
                        </li>
                        : <li
                            key={item.id}
                            className="list-group-item"
                            onClick={() => selectFolder(item.id)}
                        >
                            <i className={`fa-solid ${FOLDER_ICONS[item.id]} text-meow ps-3 pe-3`} />
                            <span>{item.name}</span>
                        </li>
                    }
                </div>)}
            </ul>
        </div>
        <button className="btn btn-success ms-3" onClick={() => save()} disabled={selectedFolder.length === 0}>Save</button>
    </div>
}
