import { useState } from 'react';
import './signupModal.css';
import axios from 'axios';

import EmailInput from '../../emailInput/emailInput';
import Error from '../../error_message/error';
import SignupTitle from '../../signupTitle/signupTitle';


export default function SignUpModal({ onClose }) {
    const [email, setEmail] = useState('');
    const [duplicate, setDuplicate] = useState(false);
    const [emailState, setEmailState] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [certification, setCertification] = useState(false);

    const [password, setPassword] = useState('');
    const [pwdState, setPwdState] = useState(false);
    const [pwdError, setPwdError] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [checkPwdError, setCheckPwdError] = useState('');
    const [error, setError] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');

        if (!emailState || !pwdState || !duplicate || !certification) {
            setError('모든 필드를 올바르게 입력해주세요.');
            return;
        }

        try {
            await axios.post('/api/auth/signup', { email, password }, {
                headers: { 'Content-Type': 'application/json' },
                
            });
            onClose();
        } catch (e) {
            setError('Signup failed. Please try again.');
            console.error('Signup error:', e);
        }
    };

    const changeHandler = (value, type) => {
        switch (type) {
            case "password":
                setPassword(value);
                if (!validatePassword(value)) {
                    setPwdError("비밀번호는 영어 + 숫자 8~20자리 입니다.");
                    setPwdState(false);
                } else {
                    setPwdError('');
                    setPwdState(true);
                }
                break;
            case "checkPassword":
                setCheckPassword(value);
                if (value !== password) {
                    setCheckPwdError("비빌번호와 비밀번호 확인이 다릅니다.");
                    setPwdState(false);
                } else {
                    setCheckPwdError("");
                    setPwdState(true);
                }
                break;
            default:
                break;
        }
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
        return regex.test(password);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <SignupTitle title={"회원가입"} onClose={onClose}/>
                
                <div className="input-group">
                    <form className='email-form' onSubmit={submitHandler}>
                        <EmailInput
                            email={email}
                            setEmail={setEmail}
                            setEmailState={setEmailState}
                            emailError={emailError}
                            setEmailError={setEmailError}
                            duplicate={duplicate}
                            setDuplicate={setDuplicate}
                            certification={certification}
                            setCertification={setCertification}
                            type={"signup"}
                        />

                        <div className="input-container">
                            <input
                                type='password'
                                name='password'
                                className='input1'
                                value={password}
                                id='password'
                                onChange={(e) => changeHandler(e.target.value, "password")}
                            />
                            <label className={`label ${password ? 'shrink' : ''}`} htmlFor="password">비밀번호</label>
                        </div>

                        {pwdError && <Error props={pwdError} />}
                        
                        <div className="input-container">
                            <input
                                type='password'
                                name='checkPassword'
                                className='input1'
                                value={checkPassword}
                                id='checkPassword'
                                onChange={(e) => changeHandler(e.target.value, "checkPassword")}
                            />
                            <label className={`label ${checkPassword ? 'shrink' : ''}`} htmlFor="checkPassword">비밀번호 확인</label>
                        </div> 
                        
                        {checkPwdError && <Error props={checkPwdError} />}
                        {error && <Error props={error} />}
                        
                        <button className='btn1 width-100' type='submit'>회원가입</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
