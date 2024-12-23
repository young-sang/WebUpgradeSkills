// HTML 요소 선택
const blogContainer = document.getElementById('blog');

// 카테고리별 폴더와 포스트 표시
function renderBlog(groupedPosts) {
    for (const [category, posts] of Object.entries(groupedPosts)) {
        // 카테고리 폴더 생성
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.innerHTML = `<h2>${category}</h2>`;

        // 포스트 목록 생성
        const postList = document.createElement('ul');
        posts.forEach(post => {
            const postItem = document.createElement('li');
            postItem.textContent = post.title;
            postItem.onclick = () => showPostContent(post);
            postList.appendChild(postItem);
        });

        // 카테고리와 목록 추가
        categoryDiv.appendChild(postList);
        blogContainer.appendChild(categoryDiv);
    }
}

// 포스트 내용 표시
function showPostContent(post) {
    alert(`Title: ${post.title}\n\n${post.content}`);
}

// 블로그 렌더링
renderBlog(groupedPosts);
