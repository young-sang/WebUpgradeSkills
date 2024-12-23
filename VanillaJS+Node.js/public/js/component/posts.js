import { resetMain } from "../utils.js";
import { renderSearhForm } from "./search.js";

// 포스트 페이지 렌더링
export const renderPostsPage = (container) => {
    resetMain();
    renderSearhForm(container);
    renderPosts(container);
};

// Post 페이지의 PostList
export const renderPosts = async (container) => {
    try {
        const data = await (await fetch('http://localhost:3000/postData')).json();
        
        const posts = data;
            
        const postsHTML = posts.map(post => `
            <article class="post-card">
                <h2>${post.title}</h2>
            </article>
        `).join('');
    
        container.innerHTML += `<section id="post-list">${postsHTML}</section>`;
    
        const articles = document.querySelectorAll(".post-card");
        articles.forEach((article, index) => {
            article.addEventListener('click', (event) => {
                event.preventDefault();
                
                renderPost(container, posts[index]);
            });
        });
    } catch (error) {
        console.error("2", error);
    }
};

// 개별 Post 페이지 렌더링
export const renderPost = (container, post) => {
    resetMain();
    const postDetail = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
    `;

    container.innerHTML = postDetail;
};

// 포스트 생성 Form
export const renderCreatePostForm = (container) => {
    const inputFrom = `
        <form id="post-form" action='http://localhost:3000/postData' method="POST">
            <input type="text" id="title" placeholder="Title" required />
            <textarea id="description" placeholder="Description" required></textarea>
            <button type="submit">추가</button>
        </form>
    `;

    //폼을 추가하고, posts 렌더링
    container.innerHTML = inputFrom;

    // 폼 제출 이벤트 리스너 추가
    const form = document.getElementById("post-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        if(title && description){
            const newData = {
                id: Date.now(),
                title: title,
                description: description,
                tag: "",
                content: ""
            };

            await fetch('http://localhost:3000/postData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData)
            })

            renderPostsPage(container);
        }
    });
}
