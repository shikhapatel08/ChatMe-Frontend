import { useDispatch, useSelector } from "react-redux";
import profile from '../../assets/Profile/profile.svg';
import './Search.css';
import { createOrGetChat, fetchMyChats, SelectedChat } from "../../Redux/Features/CreateChat";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { clearSearch, Searching } from "../../Redux/Features/SearchSlice";

export default function SearchPage() {
    const { data, loading } = useSelector(state => state.search);
    const [searchText, setSearchText] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleprofile = (userId) => {
        dispatch(createOrGetChat(Number(userId)))
            .unwrap()
            .then(async (chat) => {
                dispatch(SelectedChat(chat));
                await dispatch(fetchMyChats());
                navigate('/ChatListPage');
            })
            .catch((err) => {
                console.error("Create/Get chat failed:", err);
            });
    };

    useEffect(() => {
        if (searchText.trim() === "") {
            dispatch(clearSearch());
            return;
        }

        const timer = setTimeout(() => {
            dispatch(Searching({ name: searchText, limit: 4 }));
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchText]);


    return (
        <div className="search-container">
            <div className="search-header">
                <h2>Search Results</h2>
            </div>

            <div className="Search">
                <input
                    type='text'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Searching..."
                    className="Serach-input"
                />
            </div>
            <div className="search-results">

                {loading ? (
                    <p className="loading">Searching...</p>

                ) : data.length === 0 ? (
                    <p className="no-users">No Users Found</p>

                ) : (
                    data.map((user) => (
                        <div
                            className="search-user"
                            key={user.id}
                            onClick={() => handleprofile(user.id)}
                        >
                            <img
                                src={user?.photo ? user.photo : profile}
                                alt="profile"
                            />
                            <span>{user?.name}</span>
                        </div>
                    ))
                )}

            </div>

        </div>
    );
}
