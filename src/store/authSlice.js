import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  // initialState : 초기값
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false
  },
  reducers: {
    // 토큰과 유저 정보 저장
    // 로그인 시
    setUser: (state, action) => {
      //state = initialState(기본값)
      // action = 내가 바꾸고 싶은 값
      //          여기에선 로그인 한 유저의 정보 
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // 로컬스토리지란 클라이언트 내에서 데이터를 저장할 수 있도록 지원하는 저장소
      // key:value로 저장한다
      // 만료기간이 정해져있지 않아 직접 제거해주지 않는이상 사라지지않는다
      // 즉 로그아웃을 안하면 자동로그인을 할 수 있다는 뜻이다.
      localStorage.setItem('accessToken', action.payload.token); 
    },
    // 토큰과 유저 정보 삭제
    // 로그아웃 또는 토큰이 휴효하지 않을 시
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken'); // 토큰 삭제
    },
    // 다른 웹, 다른탭, 새로고침, URL로 직접 접근 했을 때 저장
    initializeUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
    },
    // 엑세스 토큰 만료시 토큰을 재발급 받았을 때의 토큰 저장
    updateToken: (state, action) => {
      state.token = action.payload.token;
      // 로그아웃을 했으니 로컬 스토리지의 값을 지운다.
      localStorage.setItem('accessToken', action.payload.token); // 토큰 저장
    }
  }
});
// 함수 내보내기
export const { setUser, clearUser, updateToken, initializeUser } = authSlice.actions;
// initialState
export default authSlice.reducer;
