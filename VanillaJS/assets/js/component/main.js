import { renderPosts } from './posts.js';
import { renderSearhForm } from './search.js';

export const renderMain = (container) => {

    const posts = [
        {id:1, title: 'Post 1', content: 'This is the first post'},
        {id:2, title: 'Post 2', content: 'This is the second post'},
        {id:3, title: 'Post 3', content: 'This is the third post'},
    ];
    // 태그, 카테고리

    container.innerHTML = '';
    
    renderSearhForm(container);
    renderPosts(container, posts);
}