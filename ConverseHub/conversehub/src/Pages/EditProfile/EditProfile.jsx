import React, { useState } from "react";
import "./EditProfile.css";
import profileImg from "../../assets/Profile/profile.svg";
import { useDispatch, useSelector } from "react-redux";
import { UploadImg } from "../../Redux/Features/UploadImgSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_ASSETS_API;

export default function EditProfile() {
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [bio, setBio] = useState("The End is the Beginning");
    const [gender, setGender] = useState("Female");
    const { User } = useSelector(state => state.profileuser)

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const imageUrl = avatarPreview ? avatarPreview : User?.photo ? BASE_URL + User.photo : profileImg;

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            setAvatarFile(file);
        }
    };

    const handleBackbtn = () => {
        navigate(-1);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("profile", avatarFile);
        // formData.append("bio", bio);
        // formData.append("gender", gender);

        dispatch(UploadImg(formData));
        navigate('/ProfilePage/:id');
        toast.success('Profile Photo updated successfully')
    };

    return (
        <div className="editProfile">
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

                <span><h2>Edit profile</h2></span>
            </div>

            <div className="profile-card">
                <img src={imageUrl} alt="avatar" />
                <div className="profile-info">
                    <h3>{User.name}</h3>
                </div>

                <label className="change-photo-btn">
                    Change photo
                    <input type="file" hidden onChange={handleAvatarChange} />
                </label>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Website</label>
                    <input type="text" placeholder="Website" disabled />
                    <p className="info-text">
                        Editing your links is only available on mobile.
                    </p>
                </div>

                <div className="form-group">
                    <label>Bio</label>
                    <textarea
                        maxLength={150}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                    <span className="char-count">{bio.length} / 150</span>
                </div>

                <div className="form-group">
                    <label>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                    <p className="info-text">This won’t be part of your public profile.</p>
                </div>

                <button type="submit" className="submit-btn">
                    Submit
                </button>
            </form>
        </div>
    );
}
