import React, { useState, useEffect } from 'react';
import { dataFetch } from '../js/utils.js';
import { useParams, useNavigate } from 'react-router-dom';

const PostForm = ({ mode = null }) => {
    const navigate = useNavigate();
    
    const [tags, setTags] = useState([]);
    const [categorise, setCategories] = useState([]);
    const { id } = useParams() || {};
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        tag: null,
        category: null,
    });
    
    
    useEffect(() => {
        const fetchOption = async () => {
            try {
                const data = await dataFetch("data/optionData");
                setTags(data.tags);
                setCategories(data.category);
                
                if(mode === "update" && id){
                    const postData = await dataFetch(`data/postData/${id}`);
                    
                    setFormData({
                        id: postData.id,
                        title: postData.title || '',
                        description: postData.description || '',
                        tag: postData.tag || null,
                        category: postData.category || null,
                    })
                }
            }
            catch (err) {
                console.error(err);
            }
        };

        fetchOption();
    }, [mode, id]);

    const handleChange = (e) => {
        const { name,value } = e.target;
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
            tag: formData.tag,
            category: formData.category,
            description: formData.description,
        };
        

        try{
            const url = 'http://localhost:3000/data/postData';
            const method = mode === "create" ? 'POST' : 'PUT';

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });
            navigate('/');
        }
        catch (err) {
            console.error(err);
        }
    };

    return (
        <form id="post-form" onSubmit={handleSubmit}>
            <div id="tagDiv">
                <h2>tag</h2>
                <select id="tags" name="tag" value={formData.tag} onChange={handleChange}>
                    <option value={null}>none</option>
                    {tags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>
            </div>
            <div id="categoryDiv">
                <h2>category</h2>
                <select id="category" name="category" value={formData.category} onChange={handleChange}>
                    <option value={null}>none</option>
                    {categorise.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
            <input type="text" id="title" placeholder="title" name='title' value={formData.title} onChange={handleChange} required />
            <textarea id="description" placeholder="Description" name='description' value={formData.description} onChange={handleChange} required></textarea>
            <button type="submit" id="submit-form">
                {mode === 'create' ? '추가' : '수정'}
            </button>
        </form>
    )
}

export default PostForm;