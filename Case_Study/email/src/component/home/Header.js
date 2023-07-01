import logo1 from '../../assets/images/logo-1.png';
import { Search } from './normal-user/Search';

import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../../redux/selectors';
import generalSlice from '../../redux/generalSlice';

export default function Header() {
    const user = useSelector(userSelector);
    const dispatch = useDispatch();

    function logout(e) {
        e.preventDefault();
        dispatch(generalSlice.actions.logout());
    }

    return <div id="header" className="d-flex justify-content-between text-white bg-personal m-0 py-2 fixed-top">
        <div className="d-flex align-items-center ps-3">
            <img src={logo1} className="login-page-logo bg-white" style={{ width: 30, height: 30 }} alt="logo"/>
            <span className="text-bold ps-1">{user.email}</span>
        </div>
        <div className={`d-flex w-500${user.isAdmin ? "align-items-end" : "align-items-center"}`}>
            {user.isAdmin ? "" : <Search/>}
            <button className="btn text-white" onClick={e => logout(e)}><i className=" fa-solid fa-right-from-bracket px-3"></i></button>
        </div >
    </div >
}
