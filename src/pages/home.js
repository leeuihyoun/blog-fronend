import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom';

import axios from "axios";
import { useState } from "react";
import { clearUser } from "../store/authSlice";

export default function Home(){

    const user = useSelector((state)=>state.auth);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log(user.token);


    const handleLogout = async(e) => {
        try {
            const res = await axios.post('/api/auth/logout', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token.trim()}`
                },
                withCredentials: true
            });

            dispatch(clearUser());
            navigate('/login');
        } catch (e) {
            setError("error : " + e);
        }
    }

    return(
        <div>
            <h1>Welcome, {user ? user.token : "Guest"}!</h1>
            <button onClick={handleLogout}>Logout</button>
            {error && <p style={{color:"red"}}>{error}</p>}
        </div>
    )
}