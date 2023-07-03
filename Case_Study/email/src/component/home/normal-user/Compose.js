import { useDispatch, useSelector } from 'react-redux';
import { composeSelector, userSelector } from '../../../redux/selectors';
import generalSlice, { saveMailDraftApi, sendMailApi } from '../../../redux/generalSlice';
import toastr from 'toastr';
import { EMAIL_REGEX } from '../../../constants';

export default function ComposeEmail() {
    const user = useSelector(userSelector);
    const compose = useSelector(composeSelector);
    const dispatch = useDispatch();

    function closeComposeWindow() {
        dispatch(generalSlice.actions.changeComposeOpenState());
    }
    function handleTitleChange(e) {
        dispatch(generalSlice.actions.setComposeTitle(e.target.value));
    }
    function handleToAddressChange(e) {
        dispatch(generalSlice.actions.setComposeToAddress(e.target.value));
    }
    function handleContentChange(e) {
        dispatch(generalSlice.actions.setComposeContent(e.target.value));
    }
    function sendMail(e) {
        e.preventDefault();

        if (!EMAIL_REGEX.test(compose.toAddress)) {
            toastr["error"]("'To' is not valid email format!");
            return;
        }

        if (!compose.toAddress || !compose.title) {
            toastr["error"]("'To' and 'Title' can not be empty!");
            return;
        }

        dispatch(sendMailApi({
            dataUrl: user.dataUrl,
            fromAddress: user.email,
            toAddress: compose.toAddress,
            title: compose.title,
            content: compose.content,
            id: compose.id
        }))
        // props.handleDisplayCompose();
    }

    function saveDraft(e) {
        e.preventDefault();
        dispatch(saveMailDraftApi({
            dataUrl: user.dataUrl,
            fromAddress: user.email,
            toAddress: compose.toAddress,
            title: compose.title,
            content: compose.content,
            id: compose.id
        }));
        dispatch(generalSlice.actions.changeComposeOpenState());
    }

    return <div id="compose-email-box" className="block">
        <div className="d-flex justify-content-between align-items-center bg-personal compose-header">
            <span>New mail</span>
            <button className="btn text-white" onClick={() => closeComposeWindow()}>
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
        <form className="px-2">
            <table className="table bg-white">
                <tbody>
                    <tr>
                        <td><b>To:</b></td>
                        <td>
                            <input
                                id="to"
                                name="to"
                                className="compose-input"
                                value={compose.toAddress || ""}
                                onChange={e => handleToAddressChange(e)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><b>Title:</b></td>
                        <td>
                            <input
                                id="title"
                                name="title"
                                className="compose-input"
                                value={compose.title || ""}
                                onChange={e => handleTitleChange(e)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="p-0">
                            <textarea
                                id="content"
                                name="content"
                                placeholder="Mail content..."
                                className="ps-2"
                                value={compose.content || ""}
                                onChange={e => handleContentChange(e)}
                            ></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="d-flex">
                            <button className="btn btn-success me-2" onClick={e => sendMail(e)}>Send</button>
                            <button className="btn btn-info me-4 text-white" onClick={e => saveDraft(e)}>Draft</button>
                            <div className="d-flex align-items-center">
                                <i className="fa-solid fa-a compose-icon"></i>
                                <i className="fa-solid fa-paperclip compose-icon"></i>
                                <i className="fa-regular fa-image compose-icon"></i>
                                <i className="fa-regular fa-face-smile compose-icon"></i>
                                <i className="fa-solid fa-link compose-icon"></i>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    </div>
}
