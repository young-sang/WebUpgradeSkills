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
        await axios.get('./postData.json')
        .then(res => {
            const posts = res.data;

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
        })
        .catch(error => {
            console.error("1", error);
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
        <form id="post-form">
            <input type="text" id="title" placeholder="Title" required />
            <textarea id="description" placeholder="Description" required></textarea>
            <button type="submit">제출</button>
        </form>
    `;

    //폼을 추가하고, posts 렌더링
    container.innerHTML = inputFrom;

    // 폼 제출 이벤트 리스너 추가
    const form = document.getElementById("post-form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        if(title && description){
            // // 새로운 포스트 추가
            // const newPost = {
            //     id: posts.length + 1,
            //     title,
            //     content : description
            // };
            // posts.push(newPost);

            // // 화면을 다시 렌더링하여 새로운 포스트를 표시
            renderPostsPage(container);
        }
    })
}
