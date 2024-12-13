import { renderPosts } from './posts.js';
import { renderCreateButton } from './createPost.js';

export const renderMain = (container) => {

    const posts = [
        {id:1, title: 'Post 1', content: 'This is the first post'},
        {id:2, title: 'Post 2', content: 'This is the second post'},
    ];
    
    renderPosts(container, posts);
    renderCreateButton(container, posts);
}