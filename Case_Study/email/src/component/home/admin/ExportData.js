import { useSelector } from 'react-redux';
import { mailSelector, userListSelector } from '../../../redux/selectors';
import { useState } from 'react';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';

export function ExportData() {
    const userList = useSelector(userListSelector);
    const mail = useSelector(mailSelector);
    const [selectedUser, setSelectedUser] = useState("-1");

    console.log(selectedUser.split('@')[0]);

    function exportCsv() {
        const header = Object.keys(mail.list[0]).map(item => `${item}`).join(',');
        const exportData = mail.list.map(mail =>
            Object.values(mail)
                .map(item => `${item}`.replaceAll('\n',`\\n`))
                .join(',')
        );
        exportData.unshift(header);

        return exportData.join('\n');
    }

    function exportXlsx() {
        const worksheet = XLSX.utils.json_to_sheet(mail.list.map(item => {
            const temp = JSON.parse(JSON.stringify(item))
            temp.to = item.to[0] || '';
            return temp;
        }));
        const workbook = XLSX.utils.book_new();
        const username = selectedUser.split('@')[0]
        XLSX.utils.book_append_sheet(workbook, worksheet, username);
        XLSX.writeFile(workbook, `mails.xlsx`, { compression: true });
    }

    return <div id="export-setting" className="block">
        <div className="p-3">
            <div className="fs-1 fw-light border-bottom text-center fw-bold py-3 mb-3">Export Data</div>
            <div>
                <select className="form-select" defaultValue="-1" onChange={e => setSelectedUser(e.target.value)}>
                    <option value="-1">Select user to export mails</option>
                    {userList.map(user => (
                        user.isAdmin ? "" : <option key={user.id} value={user.email}>{user.email}</option>
                    ))}
                </select>
            </div>
        </div>
        <button className="btn btn-success ms-3" disabled={selectedUser === "-1"}>
            <CSVLink data={`${exportCsv()}`} filename="mails.csv" className="text-decoration-none text-white">Export CSV</CSVLink>
        </button>
        <button className="btn btn-success ms-2" onClick={() => exportXlsx()} disabled={selectedUser === "-1"}>Export XLSX</button>
    </div>
}
