import Blocked from '../Blocked/BlockedPage';
import EditProfile from '../EditProfile/EditProfile'
import '../settings/Settings.css'
import { useState } from 'react';
import SubscriptionPlans from '../subscriptions/subscriptions';

export default function Settings() {
    const [activePage, setActivePage] = useState('edit');
    return (
        <>
            <div className="settings">
                <div className='settings-sidebar'>
                    <div className="setting-title">
                        <h2>Settings</h2>
                    </div>
                    <div className="settings-menu">
                        <span><p>How you use ChatMe</p></span>
                        <ul>
                            <li className={activePage === "edit" ? "active" : ""} onClick={() => setActivePage('edit')}>Edit Profile</li>
                        </ul>
                        <span><p>Who can see your content</p></span>
                        <ul>
                            <li className={activePage === "block" ? "active" : ""} onClick={() => setActivePage('block')}>Blocked</li>
                        </ul>
                        <span><p>What you see</p></span>
                        <ul>
                            <li className={activePage === "subscriptions" ? "active" : ""}  onClick={() => setActivePage('subscriptions')}>subscriptions</li>
                        </ul>
                    </div>
                </div>
                <div className='setting-menu-detail'>
                    {activePage === "edit" && <EditProfile />}
                    {activePage === 'block' && <Blocked/>}
                    {activePage === "subscriptions" && <SubscriptionPlans/>}
                </div>
            </div>

        </>
    )
}