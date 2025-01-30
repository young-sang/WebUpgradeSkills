import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { dataFetch, handleDelete } from '../../../js/dataUtils.js';
import { handleChange, handleSubmit } from '../../../js/formUtils.js';
import styles from '../../../css/Option.module.css';

const OptionColorSet = ({ colorSet }) => {
    const [colorIndex, setColorIndex] = useState(() => {
        // 로컬 스토리지에서 저장된 colorIndex 값을 불러오거나, 없으면 기본값 0
        const savedIndex = localStorage.getItem('colorIndex');
        return savedIndex ? parseInt(savedIndex, 10) : 0;
    });

    useEffect(() => {
        // 현재 색상을 설정
        document.documentElement.setAttribute('data-theme', colorSet[colorIndex]?.color);
        // colorIndex가 변경될 때마다 localStorage에 저장
        localStorage.setItem('colorIndex', colorIndex);
    }, [colorIndex, colorSet]);

    const handleColor = () => {
        setColorIndex((prevIndex) => (prevIndex + 1) % colorSet.length);
    };

    return (
        <section id="setColor">
            <button id="color-btn" onClick={handleColor}>색 변경</button>
        </section>
    );
};

const OptionUpdatePage = ({ itemMode = null, mode = null, handleModalOff, data = null, updateOption }) => {
    const [formData, setFormData] = useState({
        id: '',
        [itemMode]: '',
    });

    useEffect(() => {
        if(mode === 'update' && data){
            setFormData({
                id: data.id,
                [itemMode]: data[itemMode]
            })
        }
    }, [mode, data]);

    return (
        <div id='blurBackground'>
            <section id='historySet' className='popSet'>
                <div id='itemheader'>
                    <div>
                        <h3>{itemMode} {mode}</h3>
                        {data && <h3>{data[itemMode]}</h3>}
                    </div>
                    <div>
                        <i class="bx bx-x" onClick={() => handleModalOff(false)}></i>
                    </div>
                </div>
                <form id='optionItemForm' onSubmit={handleSubmit(
                    {
                        itemMode,
                        data: {
                            id: mode === 'create' ? Date.now() : formData.id,
                            [itemMode]: formData[itemMode],
                        },
                    }, 
                    'optionData', mode, (newData) => {
                        updateOption(newData.data, itemMode, mode);
                        handleModalOff();
                    }
                )}>
                    <input type='text' id='historyHead' name={itemMode} value={formData[itemMode]} onChange={handleChange(setFormData)} required />
                    <button type='submit'>{mode === 'create' ? "추가" : "수정"}</button>
                </form>
                {data && <button id='itemDelete' onClick={() => {handleDelete(`optionData/delete/${itemMode}/${data.id}`, () => {
                    updateOption(data, itemMode, 'delete');
                    handleModalOff();
                })}}>삭제</button>}
            </section>
        </div>
    )
}

const OptionItemContainer = ({itemMode, data, handleModal, setData, setMode}) => {
    

    const handleItem = (item = null, mode) => {
        handleModal(true);
        setData(item);
        setMode({
            itemMode: itemMode,
            mode: mode,
        })
    }    

    return (
        <section id="tags-items" className={styles.optionItems}>
            <h3 className={styles.optionItemsHeader}>{itemMode}</h3>
            <ul className={styles.optionItemList}>
                {(data || []).map((item, index) => (
                    <li key={index} className={styles.optionItem} data-index={index} onClick={() => handleItem(item, "update")}>{item[itemMode]}</li>
                ))}
            </ul>
            <button className={styles.btnItemAdd} onClick={() => handleItem(null, "create")}>+</button>
        </section>
    )
}

const OptionPage = () => {

    const [tag, setTag] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colorMode, setColorMode] = useState(null);
    const [isModalOn, setIsModalOn] = useState(false);
    const [selectMode, setSelectMode] = useState({
        itemMode: '',
        mode: '',
    });
    const [selectData, setSelectData] = useState(null);
    
    useEffect(() => {
        const fetchOptionData = async () => {
            const data = await dataFetch(`data/optionData`);
            setTag(data.tag);
            setCategories(data.category);
            setColorMode(data.color);
        }
        fetchOptionData();
    }, []);

    // useEffect(() => {
    //     console.log(selectData);
    //     console.log(isModalOn);
    //     console.log(selectMode);
    // }, [selectData, selectMode]);

    useEffect(() => {
        console.log("data updated");
    }, [tag, categories])


    return (
        <div>
            <OptionItemContainer 
                itemMode={"tag"} 
                data={tag} 
                handleModal={setIsModalOn}
                setData={setSelectData}
                setMode={setSelectMode}/>
            <OptionItemContainer 
                itemMode={"category"} 
                data={categories}
                handleModal={setIsModalOn}
                setData={setSelectData}
                setMode={setSelectMode}/>
            <OptionColorSet colorSet={colorMode || []}/>
            {isModalOn && (
                <OptionUpdatePage 
                    itemMode={selectMode.itemMode} 
                    mode={selectMode.mode} 
                    handleModalOff={setIsModalOn}
                    data={selectData}
                    updateOption={(updatedData, itemMode, mode) => {
                        const updateState = (stateUpdater, operation) => {
                            stateUpdater((prevList) => {
                                switch(operation){
                                    case "create":
                                        return [...prevList, updatedData];
                                    case "update":
                                        return prevList.map((item) => 
                                            item.id === updatedData.id ? updatedData : item
                                        );
                                    case "delete":
                                        return prevList.filter((item) => item.id != updatedData.id);
                                };
                            });
                        };
                        
                        switch(itemMode){
                            case "tag":
                                updateState(setTag, mode);
                                break;
                            case 'category':
                                updateState(setCategories, mode);
                                break;
                            default:
                                console.error(`Unknown itemMode: ${itemMode}`);
                        }
                    }}/>
            )}
            
        </div>
    )
};

export default OptionPage;
