import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가
import axios from 'axios';
import { useSelector } from 'react-redux';
import parse from 'html-react-parser';
import '../movie/movieDetail.css';

const genres = {
    1: '액션',
    2: '코미디',
    3: '드라마',
    4: '호러',
    5: 'SF',
    6: '판타지',
    7: '로맨스',
    8: '스릴러'
};

export default function MovieDetail() {
    const { id } = useParams();
    const [review, setReview] = useState(null);
    const token = useSelector((state) => state.auth.token);
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동을 처리

    useEffect(() => {
        if (token) {
            axios.get(`/api/auth/reviews/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setReview(response.data);
            })
            .catch(error => {
                console.error("리뷰를 불러오는 중 오류가 발생했습니다!", error);
            });
        } else {
            console.error("토큰이 존재하지 않습니다.");
        }
    }, [id, token]);

    const handleDelete = () => {
        if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
            axios.delete(`/api/auth/reviews/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                alert("리뷰가 삭제되었습니다.");
                navigate('/movie'); // 삭제 후 홈 페이지로 이동
            })
            .catch(error => {
                console.error("리뷰를 삭제하는 중 오류가 발생했습니다!", error);
            });
        }
    };

    if (!review) {
        return <p>리뷰를 불러오는 중입니다...</p>;
    }

    const genreName = genres[review.reviewCategory] || '없음';

    return (
        <div className="review-detail-container">
            <h1>{review.reviewTitle}</h1>
            <p>{new Date(review.reviewDate).toLocaleDateString()}</p>
            <p>장르: {genreName}</p>
            <div className="review-content">
                {parse(review.reviewContent)}
            </div>
            <button className="delete-button" onClick={handleDelete}>
                삭제
            </button>
        </div>
    );
}
