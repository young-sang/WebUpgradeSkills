import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link  } from "react-router-dom";
import { dataFetch } from '../../../js/dataUtils.js';
import { handleChange } from '../../../js/formUtils.js';
import styles from '../../../css/Post.module.css';


const SearchForm = ({postList, setFilteredPostList}) => {
    const [searchForm, setSearchForm] = useState({
        search: '',
    });
    

    useEffect(() => {
        if(searchForm.search === ''){
            setFilteredPostList(postList);
        }else{
            const filteredPost = postList.filter((item) => {
                return item.title.toLowerCase().includes(searchForm.search.toLowerCase());
            });
            setFilteredPostList(filteredPost);
        }
    }, [searchForm, postList, setFilteredPostList]);

    return (
        <form id="search-form">
            <input type="text" name='search' onChange={handleChange(setSearchForm)} value={searchForm.search} placeholder="Search posts..." />
        </form>
    )
}

// 포스트 리스트 페이지
const PostListPage = () => {
    const [postList, setPostList] = useState(null);
    const [filteredPostList, setFilteredPostList] = useState([]);

    // 포스트 리스트 페이지
    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 10;

    const totalPages = Math.ceil(filteredPostList.length / itemPerPage);
    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;

    // n페이지 포스트
    const currentPosts = filteredPostList.slice().slice(startIndex, endIndex);

    useEffect(() => {
        const fetchData = async () => {
            const data = await dataFetch('data/postData');
            setPostList(data);
            setFilteredPostList(data);
        };
        fetchData();
    }, []);

    useEffect(() => {}, [filteredPostList, currentPage]);

    if(!postList || postList.length === 0){
        return <p>No Post Found.</p>        
    }

    return (
        <div>
            <SearchForm postList={postList} setFilteredPostList={setFilteredPostList}/>
            <ul id={styles.postList} className="scrollable-container">
                {currentPosts.slice().map((post,index) => (
                    <li key={index} data-index={index} className={styles.postCard}>
                        <Link to={`/post/${post.id}`} >
                            <h2 className={styles.postCardHeader}>{post.title}</h2>
                            <p>{post.id}</p>
                        </Link>
                    </li>
                ))}
            </ul>
            <div className='pagination'>
                {/* 이전 페이지 버튼 */}
                <button onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1))}}
                    disabled={currentPage === 1}
                >이전</button>

                {/* 페이지 번호 */}
                {Array.from({length: totalPages}, (_, i) => (
                    <button 
                    key={i + 1}
                    className={currentPage === i + 1 ? 'active' : ''}
                    onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                ))}

                {/* 다음 페이지 버튼 */}
                <button onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))}}
                    disabled={currentPage === totalPages}
                >다음</button>
            </div>
        </div>
    );
};

export default PostListPage;