import { configureStore } from '@reduxjs/toolkit'
import SignInReducer from '../Features/SignInSlice'
import SignUpReducer from '../Features/SignUpSlice'
import UpdateProfileReducer from '../Features/UpdateProfileSlice'
import ProfileReducer from '../Features/ProfileSlice'
import UploadImgReducer from '../Features/UploadImgSlice'
import DeleteProfileReudcer from '../Features/DeleteProfileSlice'
import ResetPasswordReducer from '../Features/ResetPasswordSlice'
import FetchAllUserReducer from '../Features/AllUserSlice'
import LogoutReducer from '../Features/LogoutSlice'
import CreatechatReducer from '../Features/CreateChat' 
import BlockedReducer from '../Features/BlockedSlice'
import PinedReducer from '../Features/Pinslice'
import MuteReducer from '../Features/MuteSlice'
import SearchReducer from '../Features/SearchSlice'
import DeleteReducer from '../Features/DeleteSlice'
import MessageReducer from '../Features/SendMessage'

export const store = configureStore({
  reducer: {
    signin:SignInReducer,
    signup:SignUpReducer,
    updateProfile:UpdateProfileReducer,
    profileuser:ProfileReducer,
    uploading:UploadImgReducer,
    deleteprofile:DeleteProfileReudcer,
    resetpassword:ResetPasswordReducer,
    alluser:FetchAllUserReducer,
    logout:LogoutReducer,
    createchat:CreatechatReducer,
    blocked:BlockedReducer,
    pined:PinedReducer,
    mute:MuteReducer,
    search:SearchReducer,
    delete:DeleteReducer,
    message:MessageReducer,
  },
})