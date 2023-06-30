import logo from '../../assets/images/logo-1.png';
import { loginApi } from '../../redux/generalSlice';
import { EMAIL_REGEX } from '../../constants';

import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    email: Yup.string()
        .required("Required.")
        .matches(EMAIL_REGEX, "Wrong email address format"),
    password: Yup.string()
        .required("Required.")
})

export default function Login() {
    const dispatch = useDispatch();

    const handleLogin = values => {
        dispatch(loginApi(values));
    }

    return <div className="login-page">
        <div className="login-form">
            <div className="mb-3">
                <img src={logo} className="login-page-logo" alt="logo"/>
                <p className="fs-2 text-bold ms-2">MAIL MAIL MAIL</p>
            </div>
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={values => handleLogin(values)}
                enableReinitialize={true}
            >
                <Form>
                    <div className="mb-3">
                        <Field type="email" id="email" name="email" placeholder="Enter your email address..." className="form-control" />
                        <ErrorMessage name="email" component={"p"} style={{ color: "red" }} />
                    </div>
                    <div className="mb-3">
                        <Field type="password" id="password" name="password" placeholder="Enter your password..." className="form-control" />
                        <ErrorMessage name="password" component={"p"} style={{ color: "red" }} />
                    </div>
                    <button type="submit" className="btn btn-dark fs-5 px-5">Login</button>
                    <br />
                    <a href="Case_Study/email/src/component#" className="link-secondary text-decoration-none">Forgot password?</a>
                </Form>
            </Formik>
        </div>
    </div>
}
