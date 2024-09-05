import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../sidebar/sidebar.css'; // CSS 파일을 추가합니다.
import UserTag from '../../component/userInfo/userTag';
import { useSelector } from 'react-redux';

export default function SideBar({setShowLoginModal}) {    


    return (
        <div className="container">
            <div className="sidebar">
                <p className='nav-category'>Private Blog</p>
                <nav>
                    <NavLink to="/movie" activeClassName="active-link">영화</NavLink>
                    <NavLink to="/diary" activeClassName="active-link">일기</NavLink>
                </nav>
            </div>
        
        </div>
    );
}
