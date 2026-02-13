import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// import { useContext } from "react";
import Button from "../../Components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import '../SignIn/SignIn.css'
import login from '../../assets/login.jpg'
import { useDispatch } from "react-redux";
import { FetchUser } from "../../Redux/Features/SignInSlice";
import { toast } from "react-toastify";

const Signin = () => {
    // const { theme, getThemeStyle } = useContext(ThemeContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialValues = {
        email: "",
        password: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Minimum 6 characters")
            .required("Password is required"),
    });

    const handleSubmit = (values) => {
        dispatch(FetchUser(values))
            .unwrap()
            .then(() => {
                toast.success("Welcome back!");
                navigate('/ChatListPage');
            })
            .catch((err) => {
                console.log("LOGIN ERROR", err);

                if (
                    err?.status === 401 ||
                    err?.status === 400 ||
                    err?.message?.includes("Invalid")
                ) {
                    toast.error("Email ID and password don't match");
                }
                else if (
                    err?.message === "Network Error" ||
                    err?.status >= 500
                ) {
                    toast.error("Server error. Please try again later");
                }
                else {
                    toast.error("Something went wrong");
                }
            });
    };



    return (
        <div className="Signin">
            <div className="signin-conainer">
                <div className="Signin-left">
                    <img
                        src={login}
                        alt="login"
                    />
                </div>
                <div className="auth-box" >
                    <div className="auth-card">
                        <h2>Sign In</h2>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                <Field type="email" name="email" placeholder="Email" />
                                <ErrorMessage name="email" component="span" className="error" />

                                <div className="password-field">
                                    <Field
                                        type={'password'}
                                        name="password"
                                        placeholder="Password"
                                    />
                                </div>
                                <ErrorMessage name="password" component="span" className="error" />
                                <span className="Forgot-pass">
                                    <Link to='/ResetPassword' className="login-link">Reset Password ?</Link>
                                </span>
                                <br></br>
                                <Button type="submit" className='signin-btn'>Sign In</Button>
                                <div className="login-footer">
                                    <span className="login-text">
                                        Don't have an account?
                                        <Link to='/signup' className="login-link">SignUP</Link>
                                    </span>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;
