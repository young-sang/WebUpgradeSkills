import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { dataFetch } from '../../../js/utils.js';

const PostPage = () => {
    const navigate = useNavigate();

    const { id } = useParams();  // useParams를 사용하여 id 값을 가져옵니다.
    const [post, setPost] = useState(null);
    // const [postIndex, setPostIndex] = useState(null); // 나중에 앞 뒤 포스트 이동을 위한 변수
    const [isVisible, setIsVisible] = useState(false);

    // 데이터 fetch 및 상태 업데이트
    useEffect(() => {
        const fetchPostData = async () => {
            // 여기서는 'id'를 사용하여 해당 포스트 데이터를 가져옵니다.
            const data = await dataFetch(`data/postData/${id}`);
            setPost(data);  // 상태 업데이트
        };

        fetchPostData();  // 컴포넌트가 마운트될 때 데이터 가져오기
    }, [id]);  // id가 변경될 때마다 다시 실행되도록 설정

    const handleToggleOption = () => {
        setIsVisible((prev) => !prev);
    };

    const handleDelete = () => {
        try {
            const url = `http://localhost:3000/data/postData/delete/${id}`;
            const method = 'DELETE';
            const deleteData = async () => {
                await fetch(url, {
                    method,
                });
            };
            deleteData();
            navigate('/');
        }
        catch (err) {
            console.error(err);
        }
    }

    if (!post) {
        return <div>Loading...</div>;  // 데이터가 로딩 중일 때 표시
    }



    // post가 있으면 상세 데이터 출력
    return (
        <div>
            <i id="optionBtn" class="bx bx-menu" onClick={handleToggleOption}>
                {isVisible && ( // isVisible이 true일 때만 표시
                    <div className="optionMenuDiv">
                        <ul className="optionMenuUL">
                            <li className="postDetailMenu postUpdate">
                                <Link to={`/post/update/${id}`}>Update</Link>
                            </li>
                            <li className="postDetailMenu postDelete" onClick={handleDelete}>Delete</li>
                        </ul>
                    </div>
                )}
            </i>
            <div id="postDetail">
                <h2>{post.title}</h2>
                <p>{post.description}</p>
            </div>
        </div>
    );
};

export default PostPage;
