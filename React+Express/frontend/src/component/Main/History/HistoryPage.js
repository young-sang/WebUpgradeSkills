import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { formatDate } from '../../../js/utils.js';
import { handleChange, handleSubmit } from '../../../js/formUtils.js';
import { dataFetch, handleDelete } from '../../../js/dataUtils.js';


const HisyoryCreateForm = ({updateHistoryList}) => {
    const [formData, setFormData] = useState({
        id: '',
        content: '',
        finish: '',
        finDate: '',
    });

    return (
        <form id="history-form" onSubmit={handleSubmit(
            {
                date: formatDate(Date.now()),
                data:{
                    id: Date.now(),
                    content: formData.content,
                    finish: false,
                    finDate: null,
                },
            },
            'historyData', 'create', (newData) => {
                updateHistoryList(newData, 'create');
                setFormData({
                    id: '',
                    content: '',
                    finish: '',
                    finDate: '',
                });
            }
        )}>
            <input type="text" id="content" placeholder="Content" name='content' value={formData.content} onChange={handleChange(setFormData)} required />
            <button type="submit">추가</button>
        </form>
    )
}

const HistoryUpdatePage = ({ mode = null, handleModalOff, historyData, updateHistoryList }) => {
    const [formData, setFormData] = useState({
        id: '',
        content: '',
        finish: false,
        finDate: '',
    });

    useEffect(() => {
        if(mode === 'update' && historyData){
            setFormData({
                id: historyData.id,
                content: historyData.content || '',
                finish: historyData.finish,
                finDate: historyData.finDate
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
                        content: formData.content,
                        finish: formData.finish,
                        finDate: formData.finDate
                    },
                    'historyData', 'update', (newData) => {
                        updateHistoryList(newData, "update");
                        handleModalOff();
                    }
                )}>
                    <input type='text' id='historyContent' name='content' value={formData.content} onChange={handleChange(setFormData)} required />
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
        console.log(historyList);
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
                            setHistoryList((prevList) => {
                                const upda = prevList[updatedData.date] ? [updatedData.data, ...prevList[updatedData.date]] : [updatedData.data];

                                return {
                                    ...prevList,
                                    [updatedData.date]: upda,
                                };
                            });
                            break;
                    }
            }} />
            
            <div className='todo-container'>
                {Object.entries(historyList).reverse().map(([date, items]) => (
                    <div key={date} className='date-section'>
                        <h2 className='date-title'>{date}</h2>
                        <ul id='post-list' className='scrollable-card'>
                            {items.map((item) => (
                                <li key={item.id} className='post-card'>
                                    <p>{item.content}</p>
                                    <p>완료 여부 : {item.finish ? "완료됨" : "미완료"}</p>
                                    <button className='updateBtn' onClick={() => handleUpdatePage(item)}>수정</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* <ul id='post-list' className='scrollable-container'>
                {historyList.slice().map((item, index) => (
                    <li key={index} className='post-card'>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                        <p>{item.date}</p>
                        <button className='updateBtn' onClick={() => handleUpdatePage(item)}>수정</button>
                    </li>
                ))}
            </ul> */}
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
