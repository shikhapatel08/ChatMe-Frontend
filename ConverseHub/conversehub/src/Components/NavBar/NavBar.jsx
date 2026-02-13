/* eslint-disable react-hooks/exhaustive-deps */
import '../NavBar/Navbar.css'
import profile from '../../assets/Profile/profile.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { ProfileUser } from '../../Redux/Features/ProfileSlice';
import { useEffect, useState } from 'react';
import { clearSearch, Searching } from '../../Redux/Features/SearchSlice';
export default function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [searchText, setSearchText] = useState("");
    const { SigninUser } = useSelector(state => state.signin);
    const { User } = useSelector(state => state.profileuser);

    const showSearch = location.pathname === '/Search';

    const handleProfile = (userId) => {
        navigate(`/ProfilePage/:id`);
        dispatch(ProfileUser(userId));
    };

    const user = JSON.parse(
        localStorage.getItem('SigninUser') ||
        localStorage.getItem('SignupUser')
    );

    useEffect(() => {
        if (searchText.trim() === "") {
            dispatch(clearSearch());
            return;
        }

        const timer = setTimeout(() => {
            dispatch(Searching({ name: searchText, limit: 4 }));
        }, 200);

        return () => clearTimeout(timer);
    }, [searchText]);


    return (
        <>
            <div className="Navabar-container">
                <div className="Navabr-Left">
                    {showSearch &&
                        <div className="Navbar-Search">
                            <input
                                type='text'
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Searching..."
                                className="Navbar-Serach-input"
                            />
                        </div>
                    }
                </div>
                <div className="Navbar-Right">
                    <div className="Navbar-notification">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 16H6C5.45 16 5 15.55 5 15C5 14.45 5.45 14 6 14V10C6 6.69 8.69 4 12 4C15.31 4 18 6.69 18 10V14C18.55 14 19 14.45 19 15C19 15.55 18.55 16 18 16Z" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                    </div>
                    <div className="Navbar-Profile">
                        <div className="Navabr-Profile-User">
                            {/* <p>{SigninUser.name}</p> */}
                        </div>
                        <div className="Navbar-Profile-img">
                            <img src={User?.photo ? User?.photo : profile} alt='profile' onClick={() => handleProfile(user.id)} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}