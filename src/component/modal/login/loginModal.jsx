import { useEffect, useState } from 'react';
import './loginModal.css';
import { useDispatch, useSelector } from 'react-redux';
import kakaoImg from '../../../assets/img/kakao.png';
import naverImg from '../../../assets/img/naver.png';
import axios from 'axios';
import { initializeUser, setUser } from '../../../store/authSlice';
import FindModal from '../find/findModal';
import SignUpModal from '../signup/signupModal';
import SocialLoginButton from '../../btn/socialLoginBtn';

export default function LoginModal({onClose, errorMessage, source}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(errorMessage || '');
    const [modalType, setModalType] = useState(null); // 모달 타입 상태 추가
    const loginedUser = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (loginedUser) {
            onClose(); // 유저 정보가 있을 때 모달 닫기
        }
    }, [loginedUser, onClose]);
    
    useEffect(() => {
        if (errorMessage) {
            console.log("Error message received:", errorMessage);  // 에러 메시지 로그 출력
            setError(errorMessage); // 새로운 에러 메시지를 반영
            console.log(error)
            localStorage.removeItem("errorMessage");
        }
    }, [error, source]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!email) {
            setError('아이디를 입력해주세요.');
            return;
        }

        if (!password) {
            setError('비밀번호를 입력해주세요.');
            return;
        }


        try {
            const res = await axios.post('http://16.184.0.133:8080/api/auth/login', { email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            const accessToken = res.headers['authorization'].split(' ')[1];
            localStorage.setItem('accessToken', accessToken);
            const user = res.data;
            console.log(user)
            dispatch(setUser({ user, token: accessToken }));
            onClose();
            console.log("로그인성공")
        } catch (e) {
            setError('아이디나 비밀번호를 확인해주세요.');
            console.error('Login error:', e);
        }
    }

    const findClickHandler = () => setModalType('find');
    const signUpClickHandler = () => setModalType('signup');
    const closeModal = () => setModalType(null);

    const handleSocialLogin = async (provider) => {
        try {
            window.location.href = `http://localhost:8082/oauth2/authorization/${provider}`;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} 로그인 중 오류가 발생했습니다.`);
            }
            console.error(`${provider} login error:`, error);
        }
    };



    


    return (
        
        <div className="modal-overlay">
            <div className="modal-content">
                <div className='title1'>
                    <h2>로그인</h2>
                </div>
                <div className="input-group">
                    <form className='email-form' onSubmit={submitHandler}>
                        <div className="input-container">
                            <input type='email' name='email' className='input1' value={email} id='email'
                                onChange={(e) => setEmail(e.target.value)} />
                            <label className={`label ${email ? 'shrink' : ''}`} htmlFor="email">이메일</label>
                        </div>
                        <div className="input-container">
                            <input type='password' name='password' className='input1' value={password} id='password'
                                onChange={(e) => setPassword(e.target.value)} />
                            <label className={`label ${password ? 'shrink' : ''}`} htmlFor="password">비밀번호</label>
                        </div>
                        <div className='p-container'>
                            <div className='p-contents'>
                                <p className='find pointer' onClick={findClickHandler}>비밀번호 찾기</p>
                                <p className='pointer' onClick={signUpClickHandler}>회원가입</p>
                            </div>
                        </div>
                        <button className='btn1 width-100' style={{height:"40px"}} type='submit'>로그인</button>
                    </form>
                    {error && (<div className='error'>{error}</div>)}
                </div>
                <div className="social-login-buttons">
                    <SocialLoginButton provider="kakao" imgSrc={kakaoImg} onClick={()=>handleSocialLogin('kakao')}/>
                    <SocialLoginButton provider="naver" imgSrc={naverImg} onClick={()=>handleSocialLogin('naver')}/>
                </div>
            </div>
            {modalType === 'find' && <FindModal onClose={closeModal} />}
            {modalType === 'signup' && <SignUpModal onClose={closeModal} />}
        </div>
    );
}
