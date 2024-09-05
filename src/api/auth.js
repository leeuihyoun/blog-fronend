import { useDispatch } from 'react-redux';
import axios from './axiosConfig';
import { clearUser } from '../store/authSlice';

// 로그인한 유저의 토큰이 유효한지 검증하는 로직
export const validateToken = async (token) => {

  
  try {
    // axios = fetch, ajax와 같이 비동기통신을 할 수 있다
    const response = await axios.post('/api/auth/validate', null, {
      headers: {
        // 토큰은 기본적으로 헤더에 Authorization이라는 이름으로
        // 토큰앞에 `Bearer `을 붙혀서 보내줘야한다
        'Authorization': `Bearer ${token}`
      }
    });
    // 이건 백엔드에서 에러가 안나고 통신에 성공했으면 200코드가 뜬다.
    // 백엔드에서 상태 코드를 정의해 줄 수 있다
    if (response.status === 200) {
      // UserDTO를 같이 보내주는데 그걸 리턴해라
      // console.log(response);
      
      const user = await findUser(token);
      // console.log(user);
      return { isValid: true, user:user };
    }
    return { isValid: false, user: null };
  } catch (error) {
    // 상태코드가 200이아니라 다른 401이 온다면 토큰 재발급 함수를 실행해라
    return await reissueToken(token);
  }
};
// 토큰 재발급
// @param expiredToken(유효기간이 끝난 토큰)
const reissueToken = async (expiredToken) => {
  try {
    const response = await axios.post('/api/auth/reissue', null, {
      headers: {
        'Authorization': `Bearer ${expiredToken}`
      },
      withCredentials: true // 쿠키 전송을 위해 필요
    });
    // 200이 넘어오면 재발급 성고
    if (response.status === 200) {
      // header에서 authorization이라는 값을 가진놈의 값을 가져온다.
      // 그놈을 ` `기준으로 자르고 토큰 영역만 가져와라
      const newAccessToken = response.headers['authorization'].split(' ')[1];
      // 가져온 토큰을 로컬스토리지에 저장하고
      localStorage.setItem('accessToken', newAccessToken);
      // 
      const user = findUser(newAccessToken);
      return { isValid: true, user: user };
    } else {
      return { isValid: false, user: null };
    }
  } catch (error) {
    // 이 과정에서 에러가 났다는 것은
    // 토큰을 탈취당했을 가능성이 크다.
    // accessToken이든 refreshToken이든
    // 그래서 로그아웃 처리를 하고 다시 로그인을 시켜야한다.
    console.error('Token reissue error:', error);
    return { isValid: false, user: null };
  }
};

// 유저 정보 찾기
const findUser = async (token) => {
  if(token === null){
    return;
  }
  try{
    const response = await axios.get('/api/auth/userinfo', null, {
      headers: {
        // 토큰은 기본적으로 헤더에 Authorization이라는 이름으로
        // 토큰앞에 `Bearer `을 붙혀서 보내줘야한다
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    });
    if (response.status === 200){
      const user = response.data;
      return user;
    }
  }catch(error){
    return null;
  }
}
