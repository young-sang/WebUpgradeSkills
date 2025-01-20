import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { dataFetch, formatDate } from '../../../js/utils.js';



const HisyoryCreateForm = ({updateHistoryList}) => {
    const [formData, setFormData] = useState({
            id: '',
            title: '',
            description: '',
            date: '',
        });

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
            id: Date.now(),
            title: formData.title,
            description: formData.description,
            date: formatDate(Date.now()),
        };
        
        

        try {
            const url = 'http://localhost:3000/data/historyData';
            const method = "POST";

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });

            updateHistoryList(newData, 'create');
            setFormData({
                id: '',
                title: '',
                description: '',
                date: '',
            })
        }
        catch (err) {
            console.error(err);
        }
    }


    return (
        <form id="history-form" onSubmit={handleSubmit}>
            <input type="text" id="title" placeholder="Title" name='title' value={formData.title} onChange={handleChange} required />
            <textarea id="description" placeholder="Description" name='description' value={formData.description} onChange={handleChange} required></textarea>
            <button type="submit">추가</button>
        </form>
    )
}

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
            id: formData.id,
            title: formData.title,
            description: formData.description,
            date: formData.date,
        }

        try {
            const url = 'http://localhost:3000/data/historyData';
            const method = 'PUT';

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });

            updateHistoryList(newData, "update");
            handleModalOff();
        }
        catch (err) {
            console.error(err);
        }
    }

    const handleDelete = () => {
        try {
            const url = `http://localhost:3000/data/historyData/delete/${historyData.id}`;
            const method = 'DELETE';
            const deleteData = async () => {
                await fetch(url, {
                    method,
                });
            };
            deleteData();
            updateHistoryList(historyData, 'delete');
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
                <button id='itemDelete' onClick={handleDelete}>삭제</button>
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
            <HisyoryCreateForm
                updateHistoryList={(updatedData, mode) => {
                    switch(mode){
                        case "create":
                            console.log(updatedData);
                            setHistoryList((prevList) => [...prevList, updatedData]);
                            break;
                    }
                }} />
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
                    updateHistoryList={(updatedData, mode) => {
                        switch(mode){
                            case "update":
                                setHistoryList((prevList) => 
                                    prevList.map((item) => 
                                        item.id === updatedData.id ? updatedData : item
                                    )
                                )
                                break;
                            case 'delete':
                                console.log(updatedData);
                                setHistoryList((prevList) => 
                                    prevList.filter((item) => item.id != updatedData.id))
                                break;
                        }
                    }} />
            )}
        </div>
    )
};

export default HistoryPage;
