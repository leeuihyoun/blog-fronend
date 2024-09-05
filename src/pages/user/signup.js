import axios from "axios";
import { useState } from "react"
import { useNavigate } from 'react-router-dom';

export default function Signup(){

    // useState를 통해 onchange나 onblur를 통해 들어오는 값들을 넣어준다
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // 서버의 문제나, 중복검사, 유효성검사를 진행할 때 넣을 에러들이다
    const [error, setError] = useState('');
    // 리엑트 라우터를 쓸 때 페이지 주소를 찾아주고 보내주는 역할
    const navigate = useNavigate();

    const submitHandler = async(e)=>{
        e.preventDefault();
        setError('');

        try{
            const res = await axios.post('/api/auth/signup', {email, password},
                {headers:{
                    'Content-Type': 'application/json',
                },
            });
            // 회원가입 성공 처리
            navigate('/login')
        }catch(e){
            setError('Signup failed. Please try again.');
            console.error('Signup error:', e);
        }

    }

    return(
        <div>
            <form onSubmit={submitHandler}> 
                <input 
                    type="email"
                    name="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                />

                <input 
                    type="password"    
                    name="password"    
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                />
            </form>
            {error && <p style={{color:'red'}}>{error}</p>}
        </div>
    )
}