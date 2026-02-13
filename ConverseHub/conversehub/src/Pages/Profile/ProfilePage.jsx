import React from "react";
import "./ProfilePage.css";
import profile from '../../assets/Profile/profile.svg'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DeleteProfile } from "../../Redux/Features/DeleteProfileSlice";


export default function ProfilePage() {
  const { User } = useSelector(state => state.profileuser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEditProfile = () => {
    navigate('/EditeProfile');
  };
  const user = JSON.parse(
    localStorage.getItem('SigninUser') ||
    localStorage.getItem('SignupUser')
  );

  const handelDeleteProfile = () => {
    dispatch(DeleteProfile(user));
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="cover"></div>

        <div className="profile-image-wrapper">
          <img src={User?.photo ? User?.photo : profile} alt="profile" className="profile-image" />
        </div>

      </div>
      <div className="profile-info">
        <h2>{User.name}</h2>
        <p>{User.email}</p>
        {/* <p className="designation">Product Designer</p> */}
        {/* <p className="location">📍 Traba, Nigeria</p> */}
      </div>

      {/* <div className="profile-stats">
        <div>
          <h3>205</h3>
          <p>Followers</p>
        </div>
        <div>
          <h3>178</h3>
          <p>Following</p>
        </div>
        <div>
          <h3>68</h3>
          <p>Post</p>
        </div>
      </div> */}

      {/* BUTTONS */}
      {user.id === User.id &&
        <div className="profile-buttons">
          <button className="btn edit" onClick={handleEditProfile}>Edit Profile</button>
          <button className="btn del" onClick={handelDeleteProfile}>Delete Profile</button>
        </div>
      }
      {/* TABS */}
      <div className="profile-tabs">
        <span className="active">Photos</span>
        <span>Reels</span>
      </div>

      {/* GALLERY */}
      {/* <div className="gallery">
        <img src={profile} alt="" />
        <img src={profile} alt="" />
        <img src={profile} alt="" />
        <img src={profile} alt="" />
        <img src={profile} alt="" />
        <img src={profile} alt="" />
      </div> */}
    </div>
  );
};

