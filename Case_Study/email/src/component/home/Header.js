import logo from "../../assets/images/paw.png";
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
            <img src={logo} className="login-page-logo bg-white" style={{ width: 30, height: 30 }} alt="logo"/>
            <span className="text-bold ps-1">{user.email}</span>
        </div>
        <div className="d-flex align-items-center w-500">
            <div className="position-relative" style={{ width: "450px" }}>
                <input className="form-control" />
                <div className="bg-white w-100 position-absolute">
                    Search
                    <br/>
                    Search 2
                </div>
            </div>
            <a href="#" className="text-white me-0"><i className="fa-solid fa-gear ps-3"></i></a>
            <button className="btn text-white" onClick={e => logout(e)}><i className=" fa-solid fa-right-from-bracket px-3"></i></button>
        </div >
    </div >
}