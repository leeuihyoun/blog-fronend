import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setUser } from '../../store/authSlice';
import LoginModal from '../modal/login/loginModal';

// 소셜미디어 성공 시 redirect로 진행되 기때문에 새로 진행한다.
export default function OAuth2RedirectHandler({setShowLoginModal,setErrorMessage }) {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const errorParam = searchParams.get('error');    

        if (errorParam) {
            // app.js로부터 props를 받아와 app.js의 상태를 변화시켜준다.
            // 그 후 에러 메세지가 있으면 에러메세지를 app.js를 통해 loginModal로 보내준다
            setErrorMessage(decodeURIComponent(errorParam));
            setShowLoginModal(true); // 에러가 있을 때 모달 표시
        } else if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            dispatch(setUser({ token: accessToken }));
            navigate('/'); // 성공 시 홈으로 리디렉션
        } else {
            alert('인증 실패. 다시 시도해 주세요.');
        }
    }, [dispatch, location, navigate, setShowLoginModal, setErrorMessage]);

    return null;
}
