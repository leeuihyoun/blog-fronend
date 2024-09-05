import React, { useState, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './review.css';
import AWS from 'aws-sdk';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

// 장르와 번호를 매핑하는 객체
const genres = [
  { id: 1, name: '액션' },
  { id: 2, name: '코미디' },
  { id: 3, name: '드라마' },
  { id: 4, name: '호러' },
  { id: 5, name: 'SF' },
  { id: 6, name: '판타지' },
  { id: 7, name: '로맨스' },
  { id: 8, name: '스릴러' }
];

const MovieReviewEditor = () => {
  const [title, setTitle] = useState('');
  const token = useSelector((state) => state.auth.token);
  const user = useSelector(state => state.auth.user);
  
  const [selectedGenre, setSelectedGenre] = useState('');
  const [content, setContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const quillRef = useRef(null);
  const navigate = useNavigate();


 const uploadImage = async (file) => {
    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      Key: `movie-posters/${Date.now()}_${file.name}`,
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

  const handleSubmit = async () => {
    const reviewData = {
      reviewTitle: title,
      reviewContent: content,
      reviewCategory: parseInt(selectedGenre),  // 선택된 장르의 ID 목록을 전송
      memberIdx: user.idx
    };
    
    try {
      const response = await fetch('/api/auth/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData),
      });
  
      if (response.ok) {
        console.log('리뷰가 성공적으로 저장되었습니다.');
        navigate('/movie'); 
      } else {
        console.error('리뷰 저장 실패:', response.statusText);
      }
    } catch (error) {
      console.error('서버 오류:', error);
    }
  };

  return (
    <div className="editor-container">
      <input 
        type="text" 
        className="input"
        placeholder="리뷰 제목" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
      />
 
      <select 
        value={selectedGenre} 
        onChange={(e) => setSelectedGenre(e.target.value)}
        className="genre-select"
      >
        <option value="">장르 선택</option>
        {genres.map(genre => (
          <option key={genre.id} value={genre.id}>{genre.name}</option>
        ))}
      </select>

      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={setContent}
        modules={modules}
        placeholder="리뷰 내용을 입력하세요..."
      />
      <button className="save-button" onClick={handleSubmit}>리뷰 저장</button>
    </div>
  );
};

export default MovieReviewEditor;
