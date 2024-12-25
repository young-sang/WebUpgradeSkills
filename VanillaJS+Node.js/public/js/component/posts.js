import { eventManager, resetMain } from "../utils.js";
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
        const data = await (await fetch('http://localhost:3000/data/postData')).json();
        
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
export const renderCreatePostForm = async (container) => {

    // 초기화
    resetMain();

    const optionDatas = await (await fetch('http://localhost:3000/data/optionData')).json();

    const tagsList = optionDatas["tags"];
    const categoryList = optionDatas["category"];

    // 폼 만들기
    const postCrateForm = document.createElement('form');
    postCrateForm.id = "post-form";
    postCrateForm.action = 'http://localhost:3000/data/postData';
    postCrateForm.method = 'POST';

    // 태그 설랙선
    const tagSelect = document.createElement('select');
    tagSelect.id = "tags";
    tagSelect.name = "tags";
    tagsList.forEach(data => {
        const option = document.createElement('option');
        option.value= data;
        option.innerText = data;
        tagSelect.appendChild(option);
    });
    
    // 카테고리 셀랙션
    const categorySelect = document.createElement('select');
    categorySelect.id = "category";
    categorySelect.name = "category";
    categoryList.forEach(data => {
        const option = document.createElement('option');
        option.value= data;
        option.innerText = data;
        categorySelect.appendChild(option);
    });
    
    // 제목 인풋
    const titleForm = document.createElement('input');
    titleForm.type = "text";
    titleForm.id = "title";
    titleForm.placeholder = "title"
    titleForm.required = true;

    // 본문 텍스트 에리어
    const descriptionForm = document.createElement('textarea');
    descriptionForm.id = "description";
    descriptionForm.placeholder = "Description";
    descriptionForm.required = true;

    // 제출 버튼
    const submitForm = document.createElement('button');
    submitForm.type = "submit";
    submitForm.id = "submit-form";
    submitForm.innerText = "추가"

    // form에 요소 추가
    postCrateForm.appendChild(tagSelect);
    postCrateForm.appendChild(categorySelect);
    postCrateForm.appendChild(titleForm);
    postCrateForm.appendChild(descriptionForm);
    postCrateForm.appendChild(submitForm);


    //폼을 추가하고, posts 렌더링
    container.appendChild(postCrateForm);


    eventManager.add(container, "submit", async (event) => {

        if(event.target && event.target.matches("form#post-form")){
            event.preventDefault();

            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const tag = document.getElementById('tags').value;
            const category = document.getElementById('category').value;
    

            if(title && description){
                const newData = {
                    id: Date.now(),
                    title: title,
                    tag: tag,
                    category: category,
                    content: description,
                };
    
                await fetch('http://localhost:3000/data/postData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newData)
                })
    
                renderPostsPage(container);
            }
        }
    });
}
