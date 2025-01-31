import React, { useState, useEffect } from 'react';
import { dataFetch } from '../js/dataUtils.js';
import { useParams, useNavigate } from 'react-router-dom';
import { handleChange, handleSubmit } from '../js/formUtils.js';
import styles from '../css/Form.module.css';

export const PostForm = ({ mode = null }) => {
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
                setTags(data.tag);
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

    return (
        <form id="post-form" className={styles.postForm} onSubmit={handleSubmit(
            {
                id: mode === 'create' ? Date.now() : formData.id,
                title: formData.title,
                tag: formData.tag,
                category: formData.category,
                description: formData.description,
            },
            'postData', mode, () => {
                navigate('/');
            }
        )}>
            <div id="tagDiv">
                <h2>tag</h2>
                <select id="tags" name="tag" value={formData.tag} onChange={handleChange(setFormData)}>
                    <option value={null}>none</option>
                    {tags.map(tag => (
                        <option key={tag.tag} value={tag.tag}>{tag.tag}</option>
                    ))}
                </select>
            </div>
            <div id="categoryDiv">
                <h2>category</h2>
                <select id="category" name="category" value={formData.category} onChange={handleChange(setFormData)}>
                    <option value={null}>none</option>
                    {categorise.map(category => (
                        <option key={category.category} value={category.category}>{category.category}</option>
                    ))}
                </select>
            </div>
            <input type="text" id="title" className={styles.title} placeholder="title" name='title' value={formData.title} onChange={handleChange(setFormData)} required />
            <textarea id="description" className={styles.description} placeholder="Description" name='description' value={formData.description} onChange={handleChange(setFormData)} required></textarea>
            <button type="submit" id="submit-form">
                {mode === 'create' ? '추가' : '수정'}
            </button>
        </form>
    )
}

