export const renderPosts = (container, posts) => {
    
    const postsHTML = posts.map(post => `
        <article class="post">
            <h2>${post.title}</h2>
        </article>
    `).join('');

    container.innerHTML = postsHTML;

    const articles = document.querySelectorAll(".post");
    articles.forEach((article, index) => {
        article.addEventListener('click', (event) => {
            event.preventDefault();
            
            renderPost(container, posts[index]);
        });
    });

}


export const renderPost = (container, post) => {
    container.innerHTML = '';
    const postDetail = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
    `;

    container.innerHTML = postDetail;
};