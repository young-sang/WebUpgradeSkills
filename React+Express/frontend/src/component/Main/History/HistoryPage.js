import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { formatDate } from '../../../js/utils.js';
import { handleChange, handleSubmit } from '../../../js/formUtils.js';
import { dataFetch, handleDelete } from '../../../js/dataUtils.js';


const HisyoryCreateForm = ({updateHistoryList}) => {
    const [formData, setFormData] = useState({
            id: '',
            title: '',
            description: '',
            date: '',
        });

    return (
        <form id="history-form" onSubmit={handleSubmit(
            {
                id: Date.now(),
                title: formData.title,
                description: formData.description,
                date: formatDate(Date.now()),
            },
            'historyData', 'create', (newData) => {
                updateHistoryList(newData, 'create');
                setFormData({
                    id: '',
                    title: '',
                    description: '',
                    date: '',
                });
            }
        )}>
            <input type="text" id="title" placeholder="Title" name='title' value={formData.title} onChange={handleChange(setFormData)} required />
            <textarea id="description" placeholder="Description" name='description' value={formData.description} onChange={handleChange(setFormData)} required></textarea>
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
                <form id='historyUpdateForm' onSubmit={handleSubmit(
                    {
                        id: formData.id,
                        title: formData.title,
                        description: formData.description,
                        date: formData.date,
                    },
                    'historyData', 'update', (newData) => {
                        updateHistoryList(newData, "update");
                        handleModalOff();
                    }
                )}>
                    <input type='text' id='historyHead' name='title' value={formData.title} onChange={handleChange(setFormData)} required />
                    <textarea id='historyDescription' name='description' value={formData.description} onChange={handleChange(setFormData)} required></textarea>
                    <button type='submit'>수정</button>
                </form>
                <button id='itemDelete' onClick={() => {handleDelete(`historyData/delete/${historyData.id}`, () => {
                    updateHistoryList(historyData, 'delete');
                    handleModalOff();
                })}}>삭제</button>
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
