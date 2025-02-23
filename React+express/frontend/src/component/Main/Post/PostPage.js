import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { dataFetch, handleDelete } from '../../../js/dataUtils.js';
import styles from '../../../css/Post.module.css';

const PostPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [postList, setPostList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    // 데이터 fetch 및 상태 업데이트
    useEffect(() => {
        const fetchPostData = async () => {

            // 전체 포스트 리스트 가져오기
            const data = await dataFetch('data/postData');
            setPostList(data);

            // 현제 포스트 데이터 가져오기
            const currentPost = data.find((item) => item.id === parseInt(id));
            setPost(currentPost);

            // 현재 포스트 인덱스 설정
            const index = data.findIndex((item) => item.id === parseInt(id));
            setCurrentIndex(index);
        };

        fetchPostData();  // 컴포넌트가 마운트될 때 데이터 가져오기
    }, [id]);  // id가 변경될 때마다 다시 실행되도록 설정

    if (!post) {
        return <div>Loading...</div>;  // 데이터가 로딩 중일 때 표시
    }

    const prevPostId = currentIndex > 0 ? postList[currentIndex - 1].id : null;
    const nextPostId = currentIndex < postList.length - 1 ? postList[currentIndex + 1].id : null;

    // post가 있으면 상세 데이터 출력
    return (
        <div>
            <i id="optionBtn" class="bx bx-menu" onClick={() => setIsVisible((prev) => !prev)}>
                {isVisible && ( // isVisible이 true일 때만 표시
                    <div className="optionMenuDiv">
                        <ul className="optionMenuUL">
                            <li className="postDetailMenu postUpdate">
                                <Link to={`/post/update/${id}`}>Update</Link>
                            </li>
                            <li className="postDetailMenu postDelete" onClick={() => {
                                handleDelete(`postData/delete/${id}`, () => navigate('/'))
                                }}>Delete</li>
                        </ul>
                    </div>
                )}
            </i>
            <div id="postDetail">
                <h2>{post.title}</h2>
                <p>{post.description}</p>
            </div>

            {/* 네비게이션 */}
            <div className='navigation'>
                {/* 이전 포스트 이동 */}
                {prevPostId && (
                    <button onClick={() => navigate(`/post/${prevPostId}`)}>
                        이전 포스트
                    </button>
                )}

                {/* 다음 포스트 이동 */}
                {nextPostId && (
                    <button onClick={() => navigate(`/post/${nextPostId}`)}>
                        다음 포스트
                    </button>
                )}
            </div>
        </div>
    );
};

export default PostPage;
