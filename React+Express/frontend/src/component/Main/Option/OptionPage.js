import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { dataFetch } from '../../../js/utils';


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
            [itemMode]: formData[itemMode],
        };
        

        try {
            const url = 'http://localhost:3000/data/optionData';
            const method = mode === "create" ? 'POST' : 'PUT';

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemMode,
                    data: newData}),
            });

            updateOption(newData, itemMode);
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
                        <h3>{itemMode} Update</h3>
                        <h3>{data[itemMode]}</h3>
                    </div>
                    <div>
                        <i class="bx bx-x" onClick={() => handleModalOff(false)}></i>
                    </div>
                </div>
                <form id='optionItemForm' onSubmit={handleSubmit}>
                    <input type='text' id='historyHead' name={itemMode} value={formData[itemMode]} onChange={handleChange} required />
                    <button type='submit'>수정</button>
                </form>
                <button id='itemDelete'>삭제</button>
            </section>
        </div>
    )
}

const OptionItemContainer = ({itemMode, data, handleModal, setData, setMode}) => {
    

    const handleItem = (item, mode) => {
        handleModal(true);
        setData(item);
        setMode({
            itemMode: itemMode,
            mode: mode,
        })
    }    

    return (
        <section id="tags-items" className="option-Items">
            <h3>{itemMode}</h3>
            <ul className="OptionItemList">
                {(data || []).map((item, index) => (
                    <li key={index} className='optionItem' data-index={index} onClick={() => handleItem(item, "update")}>{item[itemMode]}</li>
                ))}
            </ul>
            <button className="btnItemAdd">+</button>
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

    useEffect(() => {
        // console.log(selectData);
        // console.log(isModalOn);
        // console.log(selectMode);
    }, [selectData]);


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
            <section id="setColor">
                <button id="color-btn">색 변경</button>
            </section>
            {isModalOn && (
                <OptionUpdatePage 
                    itemMode={selectMode.itemMode} 
                    mode={selectMode.mode} 
                    handleModalOff={setIsModalOn}
                    data={selectData}
                    updateOption={(updatedData, itemMode) => {
                        switch(itemMode){
                            case "tag":
                                setTag((prevList) => 
                                    prevList.map((item) => 
                                        item.id === updatedData.id ? updatedData : item
                                    ))
                                break;
                            case "category":
                                setCategories((prevList) => 
                                    prevList.map((item) => 
                                        item.id === updatedData.id ? updatedData : item
                                    ))
                                break;
                        }
                    }}/>
            )}
        </div>
    )
};

export default OptionPage;
