import '../SideBar/SideBar.css'
import logo from '../../assets/logo/logo.jpg'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { LogoutUser } from '../../Redux/Features/LogoutSlice';
import { useModal } from '../../Context/ModalContext';
import GlobalModal from '../Global Modal/GlobalModal';
import LogoutModal from '../Modal/LogoutModal';
import { ProfileUser } from '../../Redux/Features/ProfileSlice';

export default function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { openModal, closeModal } = useModal();

    const user = JSON.parse(
        localStorage.getItem('SigninUser') ||
        localStorage.getItem('SignupUser')
    );

    const handelLogo = () => {
        navigate('/ChatListPage');
    };

    const handelMessage = () => {
        navigate('/ChatListPage');
    };

    const handleSettings = () => {
        navigate('/Settings');
    };

    const Logout = () => {
        dispatch(LogoutUser());
        localStorage.clear();
        navigate('/');
    }

    const handleLogout = () => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <LogoutModal
                    onCancel={closeModal}
                    onConfirm={async () => {
                        await Logout();
                        closeModal();
                    }}
                />
            </GlobalModal>
        );
    };


    const handleSerach = () => {
        navigate('/Search');
    };

    const handleProfile = (userId) => {
        navigate(`/ProfilePage/:id`);
        dispatch(ProfileUser(userId));
    };

    const handleNotification = () => {
        navigate('/notofication');
    }
    return (
        <>
            <div className="Sidebar-conatiner">
                <div className="Sidebar-logo">
                    <img src={logo} alt='logo' onClick={handelLogo} />
                </div>
                <div className="Sidebar-menu">
                    <div className="Sidebar-sections">
                        <ul className="Sidebar-top-menu">
                            <li className="Sidebar-menu-1" onClick={handelMessage}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
                                    <path
                                        d="M7 8H17C17.5523 8 18 8.44772 18 9V14C18 14.5523 17.5523 15 17 15H10L7 18V9C7 8.44772 7.44772 8 8 8Z"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                                Message
                            </li>
                            <li className="Sidebar-menu-2" onClick={handleSerach}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="11"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <circle
                                        cx="11"
                                        cy="11"
                                        r="4.5"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />
                                    <line
                                        x1="14.5"
                                        y1="14.5"
                                        x2="18"
                                        y2="18"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                Search
                            </li>
                            <li className="Sidebar-menu-2" onClick={handleSettings}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="11"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="3.5"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />
                                    <path d="M12 5.5V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    <path d="M12 17V18.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    <path d="M5.5 12H7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    <path d="M17 12H18.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    <path d="M7.6 7.6L8.7 8.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    <path d="M15.3 15.3L16.4 16.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    <path d="M15.3 8.7L16.4 7.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    <path d="M7.6 16.4L8.7 15.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>

                                Settings
                            </li>
                            <li className="Sidebar-menu-3" onClick={handleNotification}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="11"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <path d="M18 16H6C5.45 16 5 15.55 5 15C5 14.45 5.45 14 6 14V10C6 6.69 8.69 4 12 4C15.31 4 18 6.69 18 10V14C18.55 14 19 14.45 19 15C19 15.55 18.55 16 18 16Z" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Notification
                            </li>
                        </ul>
                        <div style={{ marginBottom: '330px' }} />
                        <ul className="Sidebar-botton-menu">
                            <li onClick={() => handleProfile(user?.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="9" r="3" />
                                    <path d="M6.5 18a5.5 5.5 0 0 1 11 0" />
                                </svg>
                                Profile
                            </li>
                            <li onClick={handleLogout}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="11"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M16 7.5H11.5C10.9477 7.5 10.5 7.9477 10.5 8.5V15.5C10.5 16.0523 10.9477 16.5 11.5 16.5H16"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M11 12H6"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M8 10L6 12L8 14"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Logout
                            </li>
                        </ul>

                    </div>
                </div>
            </div>
        </>
    )
}