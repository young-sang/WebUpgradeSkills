import { resetMain } from "../utils.js";

export const renderHistoryPage = (container) => {
    resetMain();
    createHistory(container);
    renderHistory(container);
};


export const renderHistory = async (container) => {
    try{
        const historyData = await axios.get('./data/history.json');
        const historyHTML = historyData.data.map(history => `
            <article class="post-card">
                <h2>${history.title}</h2>
            </article>
        `).join('');

        if(!document.getElementById("post-list")){
            container.innerHTML += `<section id="post-list"></section>`; 
        }

        const postList = document.getElementById('post-list');

        postList.innerHTML = historyHTML;
    
        const articles = document.querySelectorAll(".post-card");
        // articles.forEach((article, index) => {
        //     article.addEventListener('click', (event) => {
        //         event.preventDefault();
                
        //         renderPost(container, posts[index]);
        //     });
        // });
    } catch (error) {
        console.error("2", error);
    }
};

export const createHistory = (container) => {
    // 폼 추가
    const form = document.createElement("form");
    form.id = "history-form";
    form.innerHTML = `
        <input type="text" id="title" placeholder="Title" required />
        <textarea id="description" placeholder="Description" required></textarea>
        <button type="submit">추가</button>
    `;

    container.appendChild(form);
    
    // 폼 제출 시 동작하는 이벤트 리스너
    // 컨테이너에 이벤트 위임
    form.parentElement.addEventListener('submit', async (event) => {
        if(event.target && event.target.matches('form#history-form')){
            // 기본 제출 동작을 막음
            event.preventDefault();  // 페이지 새로 고침 방지

            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;

            try {
                // 데이터 전송 코드 작성
                const data = await axios.get('./data/history.json');

                // 새로운 데이터 추가
                const newData = {title, description};
                data.data.push(newData);

                // 데이터를 서버로 전송할 경우 예시 (axios 사용)
                // await axios.post('./history.json', data.data);

                // 제출 후 페이지 갱신
                renderHistory(container);
                document.getElementById("title").value = '';
                document.getElementById("description").value = '';
                
            } catch (error) {
                console.error("에러 발생:", error);
            }    
        }
        
    }, {once:true});
};
