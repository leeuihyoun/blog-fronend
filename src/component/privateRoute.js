import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { validateToken } from '../api/auth';
import { clearUser, initializeUser } from '../store/authSlice';
import LoginModal from './modal/login/loginModal';

const PrivateRoute = ({ children }) => {

  // 로딩에 관한 상태
  // useState를 쓰는 이유는 화면에 바뀐값을 바로 렌더링 해주기위한
  // react의 문법
  const [isLoading, setIsLoading] = useState(true);
  // 유효한 토큰인지에 관한 상태
  const [isValidToken, setIsValidToken] = useState(null);
  // 토큰을 store에서 가져온다(전역적으로 뿌려진 토큰)
  const token = useSelector((state) => state.auth.token); 
  // store에서 export한 함수들을 가져온다
  const [showLoginModal, setShowLoginModal] = useState(false); // 모달 상태 추가
  const dispatch = useDispatch();

  // useEffect = 컴포넌트가 처음 나타났을때(mount), 사라졌을 때(unmount)
  //             그리고 업데이트(update) 될 때 동작을 정의할 수 있다
  useEffect(() => {
    // mount, update시 실행
    const checkToken = async () => {
      
      console.log(token);
      if (token) {
        // await : 비동기 통신을 할 때 await뒤에 있는 함수가 끝날때까지
        //         다음 줄을 실행하지 말고 대기하라는 명령어
        //         오래걸리는 작업을 끝내고 다음 코드를 실행하고 싶을 때
        //         붙힌다
        //         그리고 무조건 await을 쓴 함수에는 async를 붙혀준다
        const { isValid, user } = await validateToken(token);
        // 토큰 검증
        // auth.js에 있다
        setIsValidToken(isValid);
        if(isValid){
          dispatch(initializeUser({ user:user, token }));
         
          // console.log("세팅");
        }else{

          dispatch(clearUser());
          setShowLoginModal(true);
        }
      } else {
        setIsValidToken(false);
        setShowLoginModal(true);
      }
      setIsLoading(false);
    };

    checkToken();
  }
  // ,[]가 있으면 []안에 있는 변수, 함수들이 update될때 한번더 실행해라
  , [token, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // 토큰이 없을 떄
  if (!isValidToken) {
    // /login으로 이동해라
    return (
      <>
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </>
    );;
  }
  // PrivateRoute로 감싸준 자식을 렌더링해라
  return children;
};

export default PrivateRoute;
