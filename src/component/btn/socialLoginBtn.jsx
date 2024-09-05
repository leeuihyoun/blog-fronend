import React from 'react';
import './socialLoginBtn.css';

export default function SocialLoginButton({ provider, imgSrc, onClick }) {
    return (
        <button className="social-btn pointer" onClick={onClick}>
            <img src={imgSrc} alt={`${provider} Login`} className="social-icon" />
        </button>
    );
}
