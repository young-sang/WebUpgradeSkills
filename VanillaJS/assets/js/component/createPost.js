import { renderPosts } from './posts.js';
import { renderMain } from './main.js';

export const renderCreatePostForm = (container, posts) => {
    const inputHTML = `
        <form id="post-form">
            <input type="text" id="title" placeholder="Title" required />
            <textarea id="description" placeholder="Description" required></textarea>
            <button type="submit">제출</button>
        </form>
    `;

    //폼을 추가하고, posts 렌더링
    container.innerHTML = inputHTML;

    // 폼 제출 이벤트 리스너 추가
    const form = document.getElementById("post-form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        if(title && description){
            // 새로운 포스트 추가
            const newPost = {
                id: posts.length + 1,
                title,
                content : description
            };
            posts.push(newPost);

            // 화면을 다시 렌더링하여 새로운 포스트를 표시
            renderMain(container);
        }
    })
}

export const renderCreateButton = (container, posts) => {
    const button = document.createElement('button');
    button.textContent = '포스트 생성';

    //
    button.addEventListener('click', () => {
        const main = document.getElementById("app-content");
        main.innerHTML = '';
        renderCreatePostForm(main, posts);
    });

    container.appendChild(button);
}