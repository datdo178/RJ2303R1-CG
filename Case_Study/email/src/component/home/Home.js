import AdminSideBar from './admin/Sidebar';
import UserSideBar from './normal-user/Sidebar';
import Header from './Header';
import MailList from './normal-user/MailList';
import MailDetails from './normal-user/MailDetails';

import { Routes, Route, Navigate } from 'react-router-dom';
import { FolderSetting } from './admin/FolderSetting';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/selectors';
import { ExportData } from './admin/ExportData';
import { SETTING_TABS } from '../../constants';
import { SearchSetting } from './admin/SearchSetting';

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
                <Route path={`${SETTING_TABS[0].urlPrefix}`} element={<FolderSetting />} />
                <Route path={`${SETTING_TABS[1].urlPrefix}`} element={<ExportData />} />
                <Route path={`${SETTING_TABS[2].urlPrefix}`} element={<SearchSetting />} />
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
