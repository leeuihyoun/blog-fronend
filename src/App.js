// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import Login from './pages/user/login';
import Signup from './pages/user/signup';

import Home from './pages/home';
import Diary from './pages/diary/diary';
import DiaryAdd from './pages/diary/diaryAdd';


import PrivateRoute from './component/privateRoute';
import { clearUser, initializeUser } from './store/authSlice';
import MyPage from './pages/user/mypage';
import axios from 'axios';
import { validateToken } from './api/auth';
import Main from './pages/sidebar/sidebar';
import Movie from './pages/movie/movie';
import SideBar from './pages/sidebar/sidebar';
import Review from './pages/movie/review';
import LoginModal from './component/modal/login/loginModal';
import OAuth2RedirectHandler from './component/oauth2/OAuth2RedirectHandler';

import MovieDetail from './pages/movie/movieDetail';


function App() {

  const dispatch = useDispatch();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const user = useSelector(state => state.auth.user);
  const [errorMessage, setErrorMessage] = useState(""); // 추가된 상태

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const { isValid, user } = await validateToken(token);

        if (isValid) {
          dispatch(initializeUser({ user, token }));
        } else {
          dispatch(clearUser());
          setShowLoginModal(true);
        }
      } else {
        dispatch(clearUser());
        setShowLoginModal(true);
      }
    };

    initializeAuth();
  }, [dispatch]);

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setErrorMessage(""); // 에러 메시지 초기화
  };

  return (
      <Router>
         <SideBar setShowLoginModal={setShowLoginModal}/>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/review" element={<PrivateRoute >
            <Review />
          </PrivateRoute>}/>
          <Route path="/reviews/:id" element={<PrivateRoute >
            <MovieDetail />
          </PrivateRoute>}/>
          
          
          <Route path="/movie" element={<Movie />} />
          <Route path="/oauth2/redirect" 
          element={<OAuth2RedirectHandler setShowLoginModal={setShowLoginModal} setErrorMessage={setErrorMessage} />}  />
          <Route 
            path='/mypage' 
            element={
              // PrivateRoute란 인증이 필요한, 즉 로그인을 했을 때
              // 접근 가능하도록 세팅을 할 수 있다.
              <PrivateRoute path='/mypage'>
                {/* <Route path="/review" element={<Review />} /> */}            
                <MyPage />
              </PrivateRoute>
            }/>
          {/* <Route path="*" element={<Navigate to="/login" />} /> */}
          <Route path='/diary' element={<PrivateRoute><Diary /></PrivateRoute>} />
          <Route path='/diaryadd' element={<PrivateRoute><DiaryAdd /></PrivateRoute>} />
        </Routes>
        {showLoginModal && <LoginModal source="manual" errorMessage={errorMessage} onClose={closeLoginModal} />} {/* 로그인 모달 추가 */}
      </Router>
  );
}

export default App;
