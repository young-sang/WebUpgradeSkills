import { renderSearhForm } from "./search.js";

export const renderPostsPage = (container) => {
    container.innerHTML = '';
    
    renderSearhForm(container);
    renderPosts(container);
}

export const renderPosts = (container) => {
    (async () => {
        try {
            await axios.get('./postData.json')
            .then(res => {
                const posts = res.data;

                const postsHTML = posts.map(post => `
                    <article class="post-card">
                        <h2>${post.title}</h2>
                    </article>
                `).join('');
            
                container.innerHTML += `<section class="post-list">${postsHTML}</section>`;
            
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
    })();
};


export const renderPost = (container, post) => {
    container.innerHTML = '';
    const postDetail = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
    `;

    container.innerHTML = postDetail;
};