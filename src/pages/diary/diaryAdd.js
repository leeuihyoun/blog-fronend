import React, { useState, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import { Await, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-quill/dist/quill.snow.css';
import './css/diary.css'
import AWS from 'aws-sdk';
import { useSelector } from 'react-redux';


AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

const DiaryAdd = () => {
  const [mode, setMode] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const quillRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const token = useSelector((state) => state.auth.token);
  const user = useSelector(state => state.auth.user)

  const uploadImage = async (file) => {
    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      Key: `image/${Date.now()}_${file.name}`,
      Body: file,
      ACL: 'public-read',
    };

    try {
      const data = await s3.upload(params).promise();
      return data.Location;
    } catch (error) {
      console.error('S3 업로드 에러:', error);
      return null;
    }
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);

      const url = await uploadImage(file);
      if (url) {
        quill.insertEmbed(range.index, 'image', url);
        setUploadedImages(prev => [...prev, url]);
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
  };

  // 버튼부분
  const navigate = useNavigate();

  const backClick = () => {
      navigate("/diary");
  };

  const handleSubmit = async () => {
    const Data = {
      memberIdx : user.idx,
      diaryDate : selectedDate,
      diaryEmoji : mode,
      diaryTitle : title,
      diaryContent : content
    };

    console.log('데이터:', Data);

    try {
      const response = await fetch('/api/auth/diaryInsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(Data),
      });
      
      navigate('/diary')
      if (response.ok) {
        console.log('리뷰가 성공적으로 저장되었습니다.');

      } else {
        console.error('리뷰 저장 실패:', response.statusText);
      }
    } catch (error) {
      console.error('서버 오류:', error);
    }
  };

  return (
    <div className='container'>
      <table className="add_table">
          <tr>
              <th>날짜</th>
              <td>
                <DatePicker
                  showIcon
                  dateFormat='yyyy/MM/dd' // 날짜 형태
                  shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                />
              </td>
              <th>오늘의 기분</th>
              <td>
                  {['https://cdn-icons-png.flaticon.com/128/983/983018.png','https://cdn-icons-png.flaticon.com/128/983/983031.png','https://cdn-icons-png.flaticon.com/128/982/982995.png','https://cdn-icons-png.flaticon.com/128/983/983005.png','https://cdn-icons-png.flaticon.com/128/983/983022.png'].map((option, index) => (
                      <>
                          <input
                              className="mood_icon-div"
                              type="radio"
                              name="today_mood"
                              id={`${index}`}
                              value={`${index}`}
                              onChange={(e) => setMode(e.target.value)}
                          />
                          <label className="mood_icon-label" htmlFor={`${index}`}><img src={option}/></label>
                      </>
                  ))}
              </td>
          </tr>
          <tr>
              <th>제목</th>
              <td>
                <input 
                  type="text" 
                  className="add_textBox" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                </td>
          </tr>
      </table>
      <ReactQuill
        style={{ height: "650px"}}
        ref={quillRef}
        value={content}
        onChange={setContent}
        modules={modules}
        placeholder="내용을 입력하세요..."
      />

      <div className="btn_container">
          <button onClick={handleSubmit} className="insert_btn">등록하기</button>
          <button onClick={backClick} className="back_btn">뒤로가기</button>
      </div>

    </div>
  );
};

export default DiaryAdd;
