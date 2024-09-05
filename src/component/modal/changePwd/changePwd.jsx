import { useState } from "react";
import SignupTitle from "../../signupTitle/signupTitle";
import Error from "../../error_message/error";
import axios from "axios";

export default function ChangePwd( {onClose, email} ){
    const [newPwd, setNewPwd] = useState("");
    const [newPwdCheck, setNewPwdCheck] = useState("");
    const [pwdError, setPwdError] = useState("");
    const [error, setError] = useState("");

    const changeHandler = (value, type) => {
        switch (type) {
            case "password":
                setNewPwd(value);
                if (!validatePassword(value)) {
                    setPwdError("비밀번호는 영어 + 숫자 8~20자리 입니다.");
                } else {
                    setPwdError('');
                    setError('')
                }
                break;
            case "checkPassword":
                setNewPwdCheck(value);
                if (value !== newPwd) {
                    setError("비빌번호와 비밀번호 확인이 다릅니다.");
                    setPwdError('');
                } else {
                    setError("");
                    setPwdError('')
                }
                break;
            default:
                break;
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !newPwd || !newPwdCheck || newPwd != newPwdCheck) {
            setError('모든 필드를 올바르게 입력해주세요.');
            return;
        }

        try {
            await axios.patch('/api/auth/change-pwd', { email ,pwd: newPwd, pwdCheck: newPwdCheck }, {
                headers: { 'Content-Type': 'application/json' },
            });
            onClose();
        } catch (e) {
            setError('Signup failed. Please try again.');
            console.error('Signup error:', e);
        }
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
        return regex.test(password);
    };
    
    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <SignupTitle title={"비밀번호 변경"} onClose={onClose} />

                <div className="input-group">
                    <form onSubmit={submitHandler}> 
                        <div className="input-container">
                            <input
                                type='password'
                                name='newPwd'
                                className='input1'
                                value={newPwd}
                                id='password'
                                onChange={(e) => changeHandler(e.target.value, "password")}
                            />
                            <label className={`label ${newPwd ? 'shrink' : ''}`} htmlFor="password">비밀번호</label>
                        </div>

                        {pwdError && <Error props={pwdError} />}
                        
                        <div className="input-container">
                            <input
                                type='password'
                                name='newPwdCheck'
                                className='input1'
                                value={newPwdCheck}
                                id='newPwdCheck'
                                onChange={(e) => changeHandler(e.target.value, "checkPassword")}
                            />
                            <label className={`label ${newPwdCheck ? 'shrink' : ''}`} htmlFor="newPwdCheck">비밀번호 확인</label>
                        </div> 
                        {error && <Error props={error} />}
                        
                        <button className='btn1 width-100' type='submit'>변경</button>
                    </form>
                </div>
            </div>
        </div>
    )
}