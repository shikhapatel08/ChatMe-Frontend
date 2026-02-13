import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../Components/Button/Button";
import '../SignUp/SignUp.css'
import login from '../../assets/login.jpg'
import { useDispatch } from "react-redux";
import { AddUser } from "../../Redux/Features/SignUpSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialValues = {
        name: "",
        email: "",
        phone: "",
        password: "",
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
        phone: Yup.string()
            .matches(/^[0-9]{10}$/, "phone number must be exactly 10 digits")
            .required("phone Number is required"),
        password: Yup.string()
            .min(6, "Minimum 6 characters")
            .required("Password is required"),
    });

    const handleSubmit = (values) => {
        dispatch(AddUser(values))
            .unwrap()
            .then(() => {
                toast.success("Account created successfully!");
                navigate('/ChatListPage');
            })
            .catch((err) => {
                console.log("LOGIN ERROR", err);

                if (err?.message?.toLowerCase().includes("email")) {
                    toast.error("Email already exists");
                }
                else if (err?.message?.toLowerCase().includes("phone")) {
                    toast.error("Phone number already exists");
                }
                else if (
                    err?.message === "Network Error" ||
                    err?.status >= 500
                ) {
                    toast.error("Server error. Please try again later");
                }
                else {
                    toast.error("Signup failed. Please try again");
                }
            });
    };

    return (
        <div className="Signup">
            <div className="signup-conainer">
                <div className="Signup-left">
                    <img
                        src={login}
                        alt="login"
                    />
                </div>
                <div className="auth-box" >
                    <div className="auth-card">
                        <h2>Sign Up</h2>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            <Form >
                                <Field type="text" name="name" placeholder="Full Name" />
                                <ErrorMessage name="name" component="span" className="error" />

                                <Field type="email" name="email" placeholder="Email" />
                                <ErrorMessage name="email" component="span" className="error" />

                                <Field
                                    type='number'
                                    name="phone"
                                    placeholder="phone Num"
                                />
                                <ErrorMessage
                                    name="phone"
                                    component="span"
                                    className="error"
                                />

                                <div className="password-field">
                                    <Field
                                        type={"password"}
                                        name="password"
                                        placeholder="Password"
                                    />
                                </div>
                                <ErrorMessage name="password" component="span" className="error" />


                                <br />
                                <Button type="submit" className='Signup-btn'>Create Account</Button>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
