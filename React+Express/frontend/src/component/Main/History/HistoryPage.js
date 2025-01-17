import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { dataFetch, formatDate } from '../../../js/utils.js';



const HistoryUpdatePage = ({ mode = null, handleModalOff, historyData, updateHistoryList }) => {
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        date: '',
    });

    useEffect(() => {
        if(mode === 'update' && historyData){
            setFormData({
                id: historyData.id,
                title: historyData.title || '',
                description: historyData.description || '',
                date: historyData.date || '',
            })
        }
    }, [mode, historyData]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newData = {
            id: mode === 'create' ? Date.now() : formData.id,
            title: formData.title,
            description: formData.description,
            date: mode === 'create' ? formatDate(Date.now()) : formData.date,
        }

        try {
            const url = 'http://localhost:3000/data/historyData';
            const method = mode === "create" ? 'POST' : 'PUT';

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });

            updateHistoryList(newData);
            handleModalOff();
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <div id='blurBackground'>
            <section id='historySet'>
                <div id='itemheader'>
                    <div>
                        <h3>History Update</h3>
                    </div>
                    <div>
                        <i class="bx bx-x" onClick={handleModalOff}></i>
                    </div>
                </div>
                <form id='historyUpdateForm' onSubmit={handleSubmit}>
                    <input type='text' id='historyHead' name='title' value={formData.title} onChange={handleChange} required />
                    <textarea id='historyDescription' name='description' value={formData.description} onChange={handleChange} required></textarea>
                    <button type='submit'>수정</button>
                </form>
                <button id='itemDelete'>삭제</button>
            </section>
        </div>
    )
}


const HistoryPage = () => {
    const [historyList, setHistoryList] = useState(null);
    const [isUpdatePageOn, setIsUpdatePageOn] = useState(false);
    const [updateHistory, setUpdateHistory] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await dataFetch('data/historyData');
            setHistoryList(data);
        }
        fetchData();
    }, []);

    useEffect(() => {
        console.log("historyUpdated");
    }, [historyList]);


    const handleUpdatePage = (history) => {
        setIsUpdatePageOn(true);
        setUpdateHistory(history);
    }

    const handleUpdatePageOff = () => {
        setIsUpdatePageOn(false);
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
                        <button className='updateBtn' onClick={() => handleUpdatePage(item)}>수정</button>
                    </li>
                ))}
            </ul>
            {isUpdatePageOn && (
                <HistoryUpdatePage 
                    mode={'update'} 
                    handleModalOff={handleUpdatePageOff} 
                    historyData={updateHistory} 
                    updateHistoryList={(updatedData) => {
                        setHistoryList((prevList) => 
                            prevList.map((item) => 
                                item.id === updatedData.id ? updatedData : item
                            )
                        )
                    }} />
            )}
        </div>
    )
};

export default HistoryPage;
