import './App.css';
import { getCookie } from './assets/js/actions';
import Loading from './component/general/Loading';
import Login from './component/general/Login';

import Home from './component/home/Home';
import { BrowserRouter as Routers } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadingStateSelector, userSelector } from './redux/selectors';
import { loginWithCookieApi } from './redux/generalSlice';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const isLoading = useSelector(loadingStateSelector);
    const user = useSelector(userSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        const cookieUser = getCookie('user');

        if (cookieUser) {
            dispatch(loginWithCookieApi(JSON.parse(cookieUser)));
        }
    }, [])

    return <>
        <Routers>
            {isLoading && <Loading/>}
            {user.dataUrl ? <Home/> : <Login/>}
        </Routers>
    </>
}

export default App;
