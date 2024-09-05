import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import './css/diary.css';
import Modal from './diaryModal';
import { useSelector } from 'react-redux';
import axios from '../../api/axiosConfig';

function Diary() {
  const [value, setValue] = useState(new Date()); // 초기값은 현재 날짜
  const [selectedDiary, setSelectedDiary] = useState(null); // 선택된 날짜의 일기 데이터
  const token = useSelector((state) => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const [diaryData, setDiaryData] = useState([]);
  const navigate = useNavigate();
  
  const userId = user.idx;

  const emojiList = [
    'https://cdn-icons-png.flaticon.com/128/983/983018.png',  // 1번 이모지
    'https://cdn-icons-png.flaticon.com/128/983/983031.png',  // 2번 이모지
    'https://cdn-icons-png.flaticon.com/128/982/982995.png',  // 3번 이모지
    'https://cdn-icons-png.flaticon.com/128/983/983005.png',  // 4번 이모지
    'https://cdn-icons-png.flaticon.com/128/983/983022.png'   // 5번 이모지
  ];

  useEffect(() => {
    if (userId !== null && token) {
        axios.post('/api/auth/my-diary', { memberIdx: userId }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          console.log(response.data);
          setDiaryData(response.data); // 이모지 번호 포함한 일기 데이터를 저장
        })
        .catch(error => {
            console.error("There was an error fetching the diary data!", error);
        });
    } else {
        console.error("User ID or token is null or undefined");
    }
  }, [userId, token]);

  const onChange = (date) => {
    setValue(date);
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const diaryEntry = diaryData.find(diary => moment(diary.diaryDate).format('YYYY-MM-DD') === formattedDate);
    setSelectedDiary(diaryEntry || null); // 선택된 날짜의 일기 데이터를 상태에 저장
  };

  const onClick = () => {
    navigate("/diaryadd");
  };

  // 각 날짜 타일에 이모지 추가
  const addContent = ({ date }) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');

    // 해당 날짜에 해당하는 일기 데이터를 찾음
    const diaryEntry = diaryData.find(diary => {
      const diaryDate = moment(diary.diaryDate).format('YYYY-MM-DD');
      return diaryDate === formattedDate;
    });

    // 일기가 존재하고, diaryEmoji가 1~5 사이인 경우에만 이모지를 표시
    if (diaryEntry && diaryEntry.diaryEmoji > 0 && diaryEntry.diaryEmoji <= 5) {
      const emojiIndex = diaryEntry.diaryEmoji - 1; // 이모지 번호는 1부터 시작하므로 인덱스는 0부터 시작해야 함
      const emojiUrl = emojiList[emojiIndex];

      return (
        <div>
          <img 
            className="diaryImg" 
            src={emojiUrl} 
            alt={`diary emoji ${diaryEntry.diaryEmoji}`} 
            style={{width: '20px', height: '20px', display: 'block'}} 
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className='container'>
      
      <button onClick={onClick} className="add_btn">일정추가</button>

      <div className='test2'>
        <Calendar 
          onChange={onChange} // 선택에 따라 value 변경하는 함수(setValue의 역할)
          value={value} // 선택한 날짜 Date 형태
          next2Label={null} // 년 단위 이동 버튼
          prev2Label={null} // 년 단위 이동 버튼
          tileContent={addContent} // 날짜 칸에 보여지는 컨텐츠
          showNeighboringMonth={false} // 앞뒤 달의 이어지는 날짜 보여주기 여부
          formatDay={(locale, date) => moment(date).format("D")} // '일'자 생략
        />
        <div className='test'>
            <Modal date={value} diary={selectedDiary}/> {/* 선택된 날짜와 일기 데이터를 모듈로 전달 */}
        </div>
      </div>
        
    </div>
  );
}

export default Diary;
