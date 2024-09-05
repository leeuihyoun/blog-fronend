import { useDispatch, useSelector } from 'react-redux';
import './userInfo.css';
import InfoModal from '../info/info';
import { useEffect, useState } from 'react';
import { validateToken } from '../../api/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../../store/authSlice';

export default function UserTag(/*{setShowLoginModal}*/){
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const token = localStorage.getItem("accessToken");

    useEffect(()=>{

    },[user, token])

    const userInfoClickHandler = () => {
        onOpen();
    }

    const logoutClickHandler = async () =>{
       

        try{
            const res = await axios.post("/api/auth/logout", null,{
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true,
            })
            if(res.status === 200){
                localStorage.removeItem("accessToken");
                dispatch(clearUser());
                // setShowLoginModal(true);
                navigate("/");
            }
        }catch(e){

        }
    }

    const onOpen = () => setOpenModal(true);

    return(
        <div className='tag'>
            <p className='nav-category' onClick={userInfoClickHandler}>{user ? ("정보") : null}</p>
            <p className='nav-category' onClick={logoutClickHandler}>{user ? ("로그아웃") : null}</p>

            {openModal && (<InfoModal setOpenModal={setOpenModal}/>)}
        </div>
    )
}