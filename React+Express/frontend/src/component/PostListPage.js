import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link  } from "react-router-dom";
import { dataFetch } from '../js/utils.js';

const PostListPage = () => {
    const [postList, setPostList] = useState(null);    

    useEffect(() => {
        const fetchData = async () => {
            const data = await dataFetch('data/postData');
            setPostList(data);
        };
        fetchData();
    }, []);

    if(!postList || postList.length === 0){
        return <p>No Post Found.</p>        
    }

    return (
        <ul id="post-list" class="scrollable-container">
            {postList.slice().reverse().map((post,index) => (
                <li key={index} className='post-card'>
                    <Link to={`/post/${post.id}`} >
                        <h2>{post.title}</h2>
                        <p>{post.id}</p>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default PostListPage;