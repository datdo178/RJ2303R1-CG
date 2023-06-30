import AdminSideBar from './admin/Sidebar';
import UserSideBar from './normal-user/Sidebar';
import Header from './Header';
import MailList from './normal-user/MailList';
import MailDetails from './normal-user/MailDetails';

import { Routes, Route, Navigate } from 'react-router-dom';
import { FolderSetting } from './admin/FolderSetting';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/selectors';

export default function Home() {
    const user = useSelector(userSelector);

    return <>
        <Header/>
        <div id="wrapper" className="row m-0">
            {user.isAdmin
                ? <>
                <div className="col-3 col-md-2 m-0"><AdminSideBar/></div>
                <div className="col-10 col-mail-list ps-0 pe-3">
                <Routes>
                <Route path="*" element={<Navigate to="folder-setting" replace /> }/>
                <Route path="folder-setting" element={<FolderSetting/>} />
                <Route path="folder/:folderId/email/:mailId" element={<MailDetails/>} />
                </Routes>
                </div>
                </>
                : <>
                    <div className="col-3 col-md-2 m-0"><UserSideBar/></div>
                <div className="col-10 col-mail-list ps-0 pe-3">
                    <Routes>
                        <Route path="*" element={<Navigate to="folder/1" replace /> }/>
                        <Route path="folder/:folderId" element={<MailList/>} />
                        <Route path="folder/:folderId/email/:mailId" element={<MailDetails/>} />
                    </Routes>
                </div>
                </>
            }



        </div>
    </>
}
