import React from "react";
import { Link } from "react-router-dom";
import '../movie/movie.css';
import MyReviews from "./myreview";


export default function Movie() {
    return (
        <div className="movie-container">
            <h1>영화 페이지</h1>
            <button className="review_button">
                <Link to='/review'>영화 추가하기</Link>
            </button>
            <MyReviews />
        </div>
    )
}