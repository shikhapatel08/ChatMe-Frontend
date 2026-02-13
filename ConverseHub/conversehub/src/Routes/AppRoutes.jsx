import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "../Components/SideBar/SideBar";
// import Navbar from "../Components/NavBar/NavBar";
import Signin from "../Pages/SignIn/SignIn";
import Signup from "../Pages/SignUp/SignUp";
import ChatListPage from "../Pages/ChatList/ChatListPage";
import ProfilePage from "../Pages/Profile/ProfilePage";
import EditeProfile from '../Pages/EditeProfile/EditeProfile'
import ResetPassword from "../Pages/ResetPassword/ResetPassword";
import AuthRoutes from "./RouteGuard";
import EditProfile from "../Pages/EditProfile/EditProfile";
import Settings from "../Pages/Settings/Settings";
import RouteGuard from "./RouteGuard";
import Blocked from "../Pages/Blocked/BlockedPage";
import SearchPage from "../Pages/Search/Search";
import SubscriptionPlans from "../Pages/subscriptions/subscriptions";


export default function AppRoutes() {
    const location = useLocation();
    const hideNavbarOn = ["/Signin", "/Signup"];
    return (
        <>
            {!hideNavbarOn.includes(location.pathname) && (
                <>
                    {/* <Navbar /> */}
                    <Sidebar />
                </>
            )}
            
            <Routes>
                <Route path="/ChatListPage" element={<RouteGuard isPrivate={true}><ChatListPage/></RouteGuard>}/>
                <Route path="/ProfilePage/:id" element={<RouteGuard isPrivate={true}><ProfilePage/></RouteGuard>}/>
                <Route path="/" element={<RouteGuard isPrivate={false}><Signin/></RouteGuard>}/>
                <Route path="/Signup" element={<RouteGuard isPrivate={false}><Signup/></RouteGuard>}/>
                <Route path="/EditeProfile" element={<RouteGuard isPrivate={true}><EditeProfile/></RouteGuard>}/>
                <Route path="/ResetPassword" element={<ResetPassword/>}/>
                <Route path='/EditProfile' element={<RouteGuard isPrivate={true}><EditProfile/></RouteGuard>}/>
                <Route path='/Settings' element={<RouteGuard isPrivate={true}><Settings/></RouteGuard>}/>
                <Route path="/Blocked" element={<RouteGuard isPrivate={true}><Blocked/></RouteGuard>}/>
                <Route path="/Search" element={<RouteGuard isPrivate={true}><SearchPage/></RouteGuard>}/>
                <Route path="/subscriptions" element={<RouteGuard isPrivate={true}><SubscriptionPlans/></RouteGuard>}/>
            </Routes>
        </>
    )
}