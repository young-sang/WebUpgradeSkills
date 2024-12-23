import { eventManager, resetMain } from "../utils.js";

export const renderHistoryPage = (container) => {
    resetMain();
    createHistory(container);
    renderHistory(container);
};


export const renderHistory = async (container) => {
    console.log(1);
    try{
        const historyData = await (await fetch('http://localhost:3000/data/historyData')).json();

        const historyHTML = historyData.map(history => `
            <article class="post-card">
                <h2>${history.title}</h2>
                <p>${history.description}</p>
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
    form.action = "http://localhost:3000/data/hsitoryData";
    form.method = 'POST';
    form.innerHTML = `
        <input type="text" id="title" placeholder="Title" required />
        <textarea id="description" placeholder="Description" required></textarea>
        <button type="submit">추가</button>
    `;

    container.appendChild(form);
    
    // 폼 제출 시 동작하는 이벤트 리스너
    // 컨테이너에 이벤트 위임
    eventManager.add(container, 'submit', async (event) => {
        if(event.target && event.target.matches('form#history-form')){
            // 기본 제출 동작을 막음
            event.preventDefault();  // 페이지 새로 고침 방지

            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;

            try {
                if(title && description){
                    
                    // 새로운 데이터 추가
                    const newData = {
                        id: Date.now(),
                        title: title, 
                        description: description,
                        date: Date.now(),
                    };
                    
                    // 데이터 전송 코드 작성
                    await fetch('http://localhost:3000/data/historyData', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newData)
                    })

                    // 제출 후 페이지 갱신
                    renderHistory(container);
                    document.getElementById("title").value = '';
                    document.getElementById("description").value = '';    
                }
            } catch (error) {
                console.error("에러 발생:", error);
            }    
        }
        
    });
};
