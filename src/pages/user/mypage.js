import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector(state => state.auth.user)
  console.log(user)

  useEffect(() => {

    
  }, [token]);

  return (
    <div>
      <h1>마이페이지</h1>
      {/* <p>이메일: {userInfo.id}</p> */}
      {/* 기타 사용자 정보 표시 */}
    </div>
  );
};

export default MyPage;
