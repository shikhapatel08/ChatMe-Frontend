import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// import { useContext } from "react";
import Button from "../../Components/Button/Button";
import { Link } from "react-router-dom";
import '../ResetPassword/ResetPassword.css'
import login from '../../assets/login.jpg'
// import { useDispatch } from "react-redux";


export default function ResetPassword(){
    // const { theme, getThemeStyle } = useContext(ThemeContext);
    //   const dispatch = useDispatch();
    //   const navigate = useNavigate();

    const initialValues = {
        password: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object({
        password: Yup.string()
            .min(6, "Minimum 6 characters")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required"),
    });

    const handleSubmit = (values) => {
        console.log("dywe", values)
        // dispatch(ResetPassword(values))
        //     .unwrap()
        //     .then(() => {
        //         navigate('/');
        //     })
        //     .catch((err) => {
        //         console.log("LOGIN ERROR", err);
        //     });
    };



    return (
        <div className="resetpassword">
            <div className="resetpassword-conainer">
                <div className="resetpassword-left">
                    <img
                        src={login}
                        alt="login"
                    />
                </div>
                <div className="auth-box" >
                    <div className="auth-card">
                        <h2>Reset Password</h2>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                <div className="password-field">
                                    <Field
                                        type={'password'}
                                        name="password"
                                        placeholder="Password"
                                    />
                                </div>
                                <ErrorMessage name="password" component="span" className="error" />
                                <div className="password-field">
                                    <Field
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                    />
                                </div>
                                <ErrorMessage name="confirmPassword" component="span" className="error" />
                                <Button type="submit" className='signin-btn'>Continue</Button>
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

