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

    // 페이지 변수
    let optionVisualized = false;

    // 옵션 버튼
    const optionBtn = document.createElement('i');
    optionBtn.id = 'optionBtn';
    optionBtn.className = "bx bx-menu";

    // 포스트 내용
    const postDetail = document.createElement('div');
    postDetail.id = 'postDetail';

    const pdHeader = document.createElement('h2');
    pdHeader.innerText = post.title;

    const pdMain = document.createElement('p');
    pdMain.innerText = post.content;

    postDetail.appendChild(pdHeader);
    postDetail.appendChild(pdMain);

    // 컨테이너 추가
    container.appendChild(optionBtn);
    container.appendChild(postDetail);

    eventManager.add(container, 'click', (event) => {
        if(event.target && event.target.matches('i#optionBtn')){

            let optionMenuDiv = document.querySelector('.optionMenuDiv');

            if(!optionVisualized){
                optionMenuDiv = document.createElement('div');
                optionMenuDiv.className = 'optionMenuDiv';
        
                const optionMenuUL = document.createElement('ul');
                optionMenuUL.className = 'optionMenuUL';
        
                const updateLI = document.createElement('li');
                updateLI.className = 'postDetailMenu postUpdate';
                updateLI.innerText = 'Update';
        
                const deleteLI = document.createElement('li');
                deleteLI.className = 'postDetailMenu postDelete';
                deleteLI.innerText = 'Delete';
        
        
                optionMenuUL.appendChild(updateLI);
                optionMenuUL.appendChild(deleteLI);
                optionMenuDiv.appendChild(optionMenuUL);
                optionBtn.appendChild(optionMenuDiv);
                optionVisualized = true;
            }else{
                if(optionMenuDiv){
                    optionMenuDiv.remove();
                }
                optionVisualized = false;
            }
        } else if (event.target && event.target.matches('li.postUpdate')){
            renderPostForm(container, "update", post);
        } else if (event.target && event.target.matches('li.postDelete')) {
            console.log(2);
        }

    })
};

// 포스트 생성 Form
export const renderPostForm = async (container, mode = 'create', postData = null) => {

    // 초기화
    resetMain();

    const optionDatas = await (await fetch('http://localhost:3000/data/optionData')).json();
    const tagsList = optionDatas["tags"];
    const categoryList = optionDatas["category"];

    // 폼 만들기
    const postForm = document.createElement('form');
    postForm.id = "post-form";
    postForm.action = 'http://localhost:3000/data/postData';
    postForm.method = 'POST';
    postForm.action = 'http://localhost:3000/data/postData';
    

    // 태그 정보
    const tagDiv = document.createElement('div');
    tagDiv.id = 'tagDiv';

    const tagDivHeader = document.createElement('h2');
    tagDivHeader.innerText = 'tag';
    tagDiv.appendChild(tagDivHeader);

    // 태그 설랙선
    const tagSelect = document.createElement('select');
    tagSelect.id = "tags";
    tagSelect.name = "tags";
    tagsList.forEach(data => {
        const option = document.createElement('option');
        option.value= data;
        option.innerText = data;
        if(mode === 'update' && postData.tag === data){
            option.selected = true;
        }
        tagSelect.appendChild(option);
    });
    tagDiv.appendChild(tagSelect);
    
    // 카테고리 정보
    const categoryDiv = document.createElement('div');
    categoryDiv.id = 'categoryDiv';

    const categoryDivHeader = document.createElement('h2');
    categoryDivHeader.innerText = 'category';
    categoryDiv.appendChild(categoryDivHeader);

    // 카테고리 셀랙션
    const categorySelect = document.createElement('select');
    categorySelect.id = "category";
    categorySelect.name = "category";
    categoryList.forEach(data => {
        const option = document.createElement('option');
        option.value= data;
        option.innerText = data;
        if(mode === 'update' && postData.category === data){
            option.selected = true;
        }
        categorySelect.appendChild(option);
    });
    categoryDiv.appendChild(categorySelect);
    
    // 제목 인풋
    const titleForm = document.createElement('input');
    titleForm.type = "text";
    titleForm.id = "title";
    titleForm.placeholder = "title"
    titleForm.required = true;
    if(mode === "update" && postData.title){
        titleForm.value = postData.title;
    }

    // 본문 텍스트 에리어
    const descriptionForm = document.createElement('textarea');
    descriptionForm.id = "description";
    descriptionForm.placeholder = "Description";
    descriptionForm.required = true;
    if(mode === "update" && postData.content){
        descriptionForm.value = postData.content;
    }

    // 제출 버튼
    const submitForm = document.createElement('button');
    submitForm.type = "submit";
    submitForm.id = "submit-form";
    submitForm.innerText = mode === "create" ? "추가" : "수정";

    // form에 요소 추가
    postForm.appendChild(tagDiv);
    postForm.appendChild(categoryDiv);
    postForm.appendChild(titleForm);
    postForm.appendChild(descriptionForm);
    postForm.appendChild(submitForm);


    //폼을 추가하고, posts 렌더링
    container.appendChild(postForm);


    eventManager.add(container, "submit", async (event) => {

        if(event.target && event.target.matches("form#post-form")){
            event.preventDefault();

            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const tag = document.getElementById('tags').value;
            const category = document.getElementById('category').value;
    

            if(title && description){
                const newData = {
                    id: mode === "create" ?Date.now() : postData.id,
                    title: title,
                    tag: tag,
                    category: category,
                    content: description,
                };
    
                try {
                    const url = 'http://localhost:3000/data/postData';

                    const method = mode === "create" ? "POST" : "PUT";

                    await fetch(url, {
                        method,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newData)
                    });

                    renderPostsPage(container);
                } catch (error){
                    console.log("Error saving post:", error);
                }
            }
        }
    });
}


