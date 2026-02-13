import React, { useState } from 'react';
import './subscriptions.css'; // CSS file below
import { useNavigate } from 'react-router-dom';

export default function SubscriptionPlans({ user }) {
    const navigate = useNavigate();
    const [plans] = useState([
        {
            id: 'free',
            name: 'Free Plan',
            price: 0,
            features: ['Limited messages per day', 'No file sharing', 'Ads enabled'],
            isPremium: false
        },
        {
            id: 'premium',
            name: 'Premium Plan',
            price: 9,
            features: ['Unlimited chats', 'File & media sharing', 'Priority message delivery', 'Custom status'],
            isPremium: true
        }
    ]);
    const [userPlan] = useState(user?.subscription || 'free');

    const handleBackbtn = () => {
        navigate(-1);
    }

    return (
        <div className="plans-container">
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
                <span><h2>Subscription</h2></span>
            </div>
            <div className='plan-header'>
                <h2 style={{ textAlign: 'center' }}>
                    Find the plan that fits your needs
                </h2>
                <p style={{ textAlign: 'center' }}>Choose a plan and unlock smarter conversations</p>
            </div>
            <br></br>
            <div className="plans-grid">
                {plans.map((plan) => (
                    <div key={plan.id} className={`plan-card ${userPlan === plan.id ? 'active' : ''} ${plan.isPremium ? 'most-popular' : ''}`}>
                        <div className="plan-header">
                            <h3>{plan.name}</h3>
                            <div className="price">${plan.price}<span>/mo</span></div>
                        </div>
                        <ul className="features-list">
                            {plan.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                            ))}
                        </ul>
                        <button
                            className={`get-started-btn`}>
                            Get Started
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

