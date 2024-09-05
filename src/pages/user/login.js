import { useState } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { initializeUser, setUser } from "../../store/authSlice";
import LoginModal from "../../component/modal/login/loginModal";

export default  function Login(){



    return(
        <div>
          <LoginModal />
        </div>
    )
}