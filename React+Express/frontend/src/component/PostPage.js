import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { dataFetch } from '../js/utils.js';

const PostPage = () => {
    const { id } = useParams();  // useParams를 사용하여 id 값을 가져옵니다.
    const [post, setPost] = useState(null);

    // 데이터 fetch 및 상태 업데이트
    useEffect(() => {
        const fetchPostData = async () => {
            // 여기서는 'id'를 사용하여 해당 포스트 데이터를 가져옵니다.
            const data = await dataFetch(`data/postData/${id}`);
            setPost(data);  // 상태 업데이트
        };

        fetchPostData();  // 컴포넌트가 마운트될 때 데이터 가져오기
    }, [id]);  // id가 변경될 때마다 다시 실행되도록 설정

    if (!post) {
        return <div>Loading...</div>;  // 데이터가 로딩 중일 때 표시
    }

    // post가 있으면 상세 데이터 출력
    return (
        <div id="postDetail">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
        </div>
    );
};

export default PostPage;
