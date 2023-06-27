import SideBar from './Sidebar';
import Header from './Header';
import MailList from './MailList';
import MailDetails from './MailDetails';

import { Routes, Route } from 'react-router-dom';

export default function Home() {
    return <>
        <Header/>
        <div id="wrapper" className="row m-0">
            <div className="col-3 col-md-2 m-0"><SideBar/></div>
            <div className="col-10 col-mail-list ps-0 pe-3">
                <Routes>
                    <Route path="/" element={<MailList/>} />
                    <Route path="folder/:folderId" element={<MailList/>} />
                    <Route path="folder/:folderId/email/:mailId" element={<MailDetails/>} />
                </Routes>
            </div>
        </div>
    </>
}
