import React from 'react';
import './css/modal.css'; // CSS 파일 임포트

function Modal(props) {
    const { diary } = props;

    return (
        <div className="box">
            {diary ? (
                <div>
                    <h2>{diary.diaryTitle}</h2>
                    <div dangerouslySetInnerHTML={{ __html: diary.diaryContent }} />
                </div>
            ) : (
                <p>선택된 날짜에 일기가 없습니다.</p>
            )}
        </div>
    );
}

export default Modal;
