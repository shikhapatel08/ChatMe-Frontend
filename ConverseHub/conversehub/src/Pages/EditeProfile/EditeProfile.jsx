import React from "react";
import "./EditeProfile.css";
import profile from "../../assets/Profile/profile.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setUserFromUpdate } from "../../Redux/Features/ProfileSlice";
import { UpdateUser } from "../../Redux/Features/UpdateProfileSlice";
import { toast } from "react-toastify";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { User } = useSelector((state) => state.profileuser);
  const loading = useSelector((state) => state.updateprofile?.loading);


  // const [avatar, setAvatar] = useState(profile);

  const handleViewProfile = () => navigate("/ProfilePage");

  // const handleAvatarChange = (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setAvatar(URL.createObjectURL(e.target.files[0]));
  //   }
  // };

  // 🔹 PROFILE FORM
  const profileFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: User?.name || "",
      email: User?.email || "",
      phone: User?.phone || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3).required("Name required"),
      email: Yup.string().email().required("Email required"),
      phone: Yup.string().matches(/^[0-9]{10}$/).required("Phone required"),
    }),
    onSubmit: (values) => {
      dispatch(UpdateUser({ type: "profile", data: values }))
        .unwrap()
        .then(() => {
          dispatch(setUserFromUpdate(values));
          toast.success(`Profile updated successfully`)
          navigate("/ProfilePage");
        });
    },
  });

  // 🔹 PASSWORD FORM
  const passwordFormik = useFormik({
    initialValues: { newPassword: "" },
    validationSchema: Yup.object({
      // oldPassword: Yup.string().required("Old password required"),
      newPassword: Yup.string().min(6).required("New password required"),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(UpdateUser({ type: "resetpassword", data: values }))
        .unwrap()
        .then(() => {
          toast.success("Password updated successfully");
          navigate("/ProfilePage");
          resetForm();
        });
    },
  });

  return (
    <div className="settings-container">

      {/* HEADER */}
      <div className="settings-header">
        <div className="cover"></div>
        <div className="profile-img">
          <img src={User.photo ? User.photo : profile} alt="Profile Avatar" />
        </div>
        <div className="profile-info">
          <h2>{User?.name}</h2>
          <p>{User?.email}</p>
          <div className="profile-buttons">
            <button className="btn view-profile" onClick={handleViewProfile}>
              View Profile
            </button>
          </div>
        </div>
      </div>

      <div className="settings-form">

        {/* LEFT INFO */}
        <div className="form-left">
          <h3>Profile Settings</h3>
          <p>You can update your profile information and password here.</p>
        </div>

        {/* RIGHT SIDE FORMS */}
        <div className="form-right">

          {/* ===== PROFILE UPDATE ===== */}
          <form onSubmit={profileFormik.handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input name="name" value={profileFormik.values.name} onChange={profileFormik.handleChange} />
              {profileFormik.touched.name && profileFormik.errors.name && (
                <div className="error">{profileFormik.errors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input name="email" value={profileFormik.values.email} onChange={profileFormik.handleChange} />
              {profileFormik.touched.email && profileFormik.errors.email && (
                <div className="error">{profileFormik.errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={profileFormik.values.phone} onChange={profileFormik.handleChange} />
              {profileFormik.touched.phone && profileFormik.errors.phone && (
                <div className="error">{profileFormik.errors.phone}</div>
              )}
            </div>
{/* 
            <div className="form-group">
              <label>Change Avatar</label>
              <div className="avatar-upload">
                <img src={avatar} alt="Avatar Preview" className="avatar-preview" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
                <p>Click or drag to upload</p>
              </div>
            </div> */}

            <button type="submit" className="btn view-profile" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>

          {/* ===== PASSWORD UPDATE ===== */}
          <form onSubmit={passwordFormik.handleSubmit} style={{ marginTop: "40px" , color:'black' }}>
            <h3>Change Password</h3>
{/* 
            <div className="form-group">
              <label>Old Password</label>
              <input type="password" name="oldPassword" onChange={passwordFormik.handleChange} value={passwordFormik.values.oldPassword} />
              {passwordFormik.touched.oldPassword && passwordFormik.errors.oldPassword && (
                <div className="error">{passwordFormik.errors.oldPassword}</div>
              )}
            </div> */}

            <div className="form-group">
              <label>New Password</label>
              <input type="password" name="newPassword" onChange={passwordFormik.handleChange} value={passwordFormik.values.newPassword} />
              {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                <div className="error">{passwordFormik.errors.newPassword}</div>
              )}
            </div>

            <button type="submit" className="btn view-profile" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
