import React, { useState } from 'react';
import './findModal.css';
import EmailInput from '../../emailInput/emailInput';
import ChangePwd from '../changePwd/changePwd';
import SignupTitle from '../../signupTitle/signupTitle';

export default function FindModal({ onClose }) {
    const [email, setEmail] = useState('');
    const [duplicate, setDuplicate] = useState(false);
    const [emailState, setEmailState] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [certification, setCertification] = useState(false);


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <SignupTitle title={"비밀번호 찾기"} onClose={onClose}/>
                {/* 추가적인 비밀번호 찾기 기능 구현 */}
                {/* 이메일을 넣어서 이메일 인증을 진행하고, 성공 시 비밀번호 변경으로 간다
                    그럼 이메일 인증을 컴포넌트화 해야한다 */}
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
                        type={"find"}
                    />
            </div>
            {/* 이메일 인증 성공 시 비밀번호 변경 모달이 떠야한다. */}
            {certification && (<div> <ChangePwd onClose={onClose} email={email}/> </div>)}
            
        </div>
    );
}