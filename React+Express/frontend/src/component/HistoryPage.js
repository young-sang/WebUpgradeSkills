import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { dataFetch } from '../js/utils.js';


const HistoryUpdatePage = () => {

    return (
        <div id='blurBackground'>
            <section>
                <div id='itemheader'></div>
                <form></form>
                <button></button>
            </section>
        </div>
    )
}


const HistoryPage = () => {
    const [historyList, setHistoryList] = useState(null);
    const [isModalOn, setIsModalOn] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const data = await dataFetch('data/historyData');
            setHistoryList(data);
        }
        fetchData();
    }, []);


    const handleUpdate = () => {
        
    }

    if(!historyList || historyList.length === 0){
        return <p>No history Found.</p>
    }

    return (
        <div>
            <ul id='post-list' className='scrollable-container'>
                {historyList.slice().reverse().map((item, index) => (
                    <li key={index} className='post-card'>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                        <p>{item.date}</p>
                        <button className='updateBtn' onClick={handleUpdate}>수정</button>
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default HistoryPage;
