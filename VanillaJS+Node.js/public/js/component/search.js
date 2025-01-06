import { eventManager, removeContainer, resetMain } from "../utils.js";
import { renderPosts, updatePostList } from "./posts.js";

export const renderSearhForm = async (container) => {
    const searchForm = document.createElement('form');
    searchForm.id = 'search-form';
    searchForm.method = 'POST';
    searchForm.innerHTML = `
        <input type="text" placeholder="Search posts...">
    `;
    
    container.appendChild(searchForm);

    const data = await((await fetch('http://localhost:3000/data/postData')).json());

    eventManager.remove(container, 'input');

    eventManager.add(container, 'input', (event) => {
        const inputValue = event.target.value.toLowerCase();
        const filteredData = data.filter(item => item.title.toLowerCase().includes(inputValue));

        const postContainer = document.getElementById('post-list');
        updatePostList(postContainer, filteredData);
    });
}