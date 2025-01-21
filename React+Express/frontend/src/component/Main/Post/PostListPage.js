import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link  } from "react-router-dom";
import { dataFetch } from '../../../js/dataUtils.js';
import { handleChange } from '../../../js/formUtils.js';


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

const PostListPage = () => {
    const [postList, setPostList] = useState(null);
    const [filteredPostList, setFilteredPostList] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await dataFetch('data/postData');
            setPostList(data);
            setFilteredPostList(data);
        };
        fetchData();
    }, []);

    useEffect(() => {}, [filteredPostList]);

    if(!postList || postList.length === 0){
        return <p>No Post Found.</p>        
    }

    return (
        <div>
            <SearchForm postList={postList} setFilteredPostList={setFilteredPostList}/>
            <ul id="post-list" className="scrollable-container">
                {filteredPostList.slice().reverse().map((post,index) => (
                    <li key={index} className='post-card'>
                        <Link to={`/post/${post.id}`} >
                            <h2>{post.title}</h2>
                            <p>{post.id}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostListPage;