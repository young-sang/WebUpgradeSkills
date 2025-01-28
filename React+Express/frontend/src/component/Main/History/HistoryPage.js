import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { formatDate } from '../../../js/utils.js';
import { handleChange, handleSubmit } from '../../../js/formUtils.js';
import { dataFetch, handleDelete } from '../../../js/dataUtils.js';

// 히스토리 생성 폼
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

// 히스토리 업데이트 폼
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
                id: historyData.data.id,
                content: historyData.data.content || '',
                finish: historyData.data.finish,
                finDate: historyData.data.finDate
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
                        date: historyData.date,
                        data: {
                            id: formData.id,
                            content: formData.content,
                            finish: formData.finish,
                            finDate: formData.finDate
                        }
                    },
                    'historyData', 'update', (newData) => {
                        updateHistoryList(newData, "update");
                        handleModalOff();
                    }
                )}>
                    <input type='text' id='historyContent' name='content' value={formData.content} onChange={handleChange(setFormData)} required />
                    <button type='submit'>수정</button>
                </form>
                <button id='itemDelete' onClick={() => {handleDelete(`historyData/delete/${historyData.date}/${historyData.data.id}`, () => {
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
        console.log(1);
        console.log(historyList);
    }, [historyList]);


    const handleUpdatePage = (date, data) => {
        setIsUpdatePageOn(true);
        setUpdateHistory({date, data});
    }

    
    const handleFinish = (item) => {
        console.log(item);
    }

    const handleUpdatePageOff = () => {
        setIsUpdatePageOn(false);
    }


    if(!historyList || historyList.length === 0){
        return <p>No history Found.</p>
    }

    return (
        <div>
            {/* 히스토리 추가 FORM */}
            <HisyoryCreateForm
                updateHistoryList={(updatedData, mode) => {
                    switch(mode){
                        case "create":
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
            
            {/* 히스토리 나열 */}
            <div className='todo-container'>
                {Object.entries(historyList).reverse().map(([date, items]) => (
                    <div key={date} className='date-section'>
                        <h2 className='date-title'>{date}</h2>
                        <ul id='post-list' className='scrollable-card'>
                            {items.map((item) => (
                                <li key={item.id} className='post-card'>
                                    <p>{item.content}</p>
                                    <p>완료 여부 : {item.finish ? "완료됨" : "미완료"}</p>
                                    <button className='updateBtn' onClick={() => handleFinish(item)}>완료</button>
                                    <button className='updateBtn' onClick={() => handleUpdatePage(date, item)}>수정</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* 업데이트 폼 */}
            {isUpdatePageOn && (
                <HistoryUpdatePage 
                    mode={'update'} 
                    handleModalOff={handleUpdatePageOff} 
                    historyData={updateHistory} 
                    updateHistoryList={(updatedData, mode) => {
                        switch(mode){
                            case "update":
                                console.log(updatedData);
                                console.log(historyList);
                                setHistoryList((prevList) => {
                                    // prevList를 복사
                                    const updatedList = { ...prevList };
                                  
                                    // updatedData.date 키의 배열이 존재하는지 확인
                                    if (updatedList[updatedData.date]) {
                                      updatedList[updatedData.date] = updatedList[updatedData.date].map((item) =>
                                        item.id === updatedData.data.id ? updatedData.data : item
                                      );
                                    } else {
                                      console.error("해당 날짜에 대한 데이터가 없습니다.");
                                    }
                                  
                                    return updatedList;
                                  });
                                break;
                            case 'delete':
                                setHistoryList((prevList) => {
                                    const deleteList = {...prevList };
                                    console.log(deleteList[updatedData.date]);

                                    if(deleteList[updatedData.date]){
                                        deleteList[updatedData.date] =  deleteList[updatedData.date].filter((item) => item.id != updatedData.data.id)
                                    } else {
                                        console.error("에러");
                                    }
                                    console.log(deleteList);
                                    return deleteList;
                                })
                                break;
                        }
                    }} />
            )}
        </div>
    )
};

export default HistoryPage;
