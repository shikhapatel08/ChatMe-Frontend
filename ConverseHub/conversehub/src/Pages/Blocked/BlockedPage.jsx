import { useNavigate } from "react-router-dom";
import profile from '../../assets/Profile/profile.svg';
import '../Blocked/BlockedPage.css';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchMyChats } from "../../Redux/Features/CreateChat";
import { BlockedUser } from "../../Redux/Features/BlockedSlice";
import { toast } from "react-toastify";

export default function Blocked() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { chats } = useSelector(state => state.createchat);

    const user = JSON.parse(
        localStorage.getItem('SigninUser') ||
        localStorage.getItem('SignupUser')
    );
    const JoinUser = user.id;

    const getOtherUser = (chat, joinUserId) => {
        return chat.UserOne.id === joinUserId ? chat.UserTwo : chat.UserOne;
    };

    const blockedChats = chats
        .filter(chat => chat.is_blocked)
        .map(chat => ({
            ...getOtherUser(chat, JoinUser),
            chatId: chat.id,
        }));


    const handleBackbtn = () => {
        navigate(-1);
    }

    const handelBlocked = (chatId) => {
        dispatch(BlockedUser(chatId)).then(() => {
            dispatch(fetchMyChats());
        })
        toast.success('User Unblocked!')
    };

    useEffect(() => {
        dispatch(fetchMyChats());
    }, [dispatch]);

    return (
        <div className="bolcked-container">
            <div className="back-button">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    width="24"
                    height="24"
                    onClick={handleBackbtn}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                <span><h2>Blocked accounts</h2></span>
            </div>

            <div className="blocked-account">
                <p>You can block people anytime from their profiles.</p>

                {blockedChats.length > 0 ? (
                    blockedChats.map(user => (
                        <div className="blocked-users" key={user.id}>
                            <img src={user.photo ? user.photo : profile} alt="profile" />
                            <span>{user.name}</span>
                            <button onClick={() => handelBlocked(user.chatId)}>
                                Unblock
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No Blocked User</p>
                )}
            </div>
        </div>
    )
}
