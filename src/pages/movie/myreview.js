import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import './myreview.css';
import { Link } from 'react-router-dom';


export default function MyReviews() {
    const [reviews, setReviews] = useState([]);
    const token = useSelector((state) => state.auth.token);
    const user = useSelector(state => state.auth.user);
    
    const userId = user?.idx;
    
    useEffect(() => {
        if (userId !== null && token) {
            axios.post('/api/auth/my-reviews', { memberIdx: userId }, {
                headers: {
                    'Authorization': `Bearer ${token}`  // 토큰을 포함시킴
                }
            })
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the reviews!", error);
            });
        } else {
            console.error("User ID or token is null or undefined");
        }
    }, [userId, token]);

    return (
        <div className="container">
            <h1 className="title">내 리뷰 목록</h1>
            {reviews.length === 0 ? (
                <p className="no-reviews-message">리뷰가 없습니다.</p>
            ) : (
                <ul className="review-list">
                    {reviews.map(review => (
                        <li key={review.reviewIdx} className="review-item">
                            <Link to={`/reviews/${review.reviewIdx}`}>
                                <h3 className="review-title">{review.reviewTitle}</h3>
                                <p className="review-date">작성일: {new Date(review.reviewDate).toLocaleDateString()}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
