import { useSelector } from 'react-redux';
import { userListSelector } from '../../../redux/selectors';
import { useState } from 'react';

export function ExportData() {
    const userList = useSelector(userListSelector);
    const [selectedUser, setSelectedUser] = useState("-1");

    function exportFile() {
        if (selectedUser === "-1") {
            return;
        }
        console.log(selectedUser);
    }

    return <div id="folder-setting" className="block">
        <div className="p-3">
            <div className="fs-1 fw-light border-bottom text-center fw-bold py-3 mb-3">Export Data</div>
            <div>
                <select className="form-select" defaultValue="-1" onChange={e => setSelectedUser(e.target.value)}>
                    <option value="-1">Select user to export mails</option>
                    {userList.map(user => (
                        user.isAdmin ? "" : <option key={user.id} value={user.id}>{user.email}</option>
                    ))}
                </select>
            </div>
        </div>
        <button className="btn btn-success ms-3" onClick={() => exportFile()}>Save</button>
    </div>
}
