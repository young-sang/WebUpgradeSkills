import { eventManager, formatDate, resetMain } from "../utils.js";

let modalPageOn = false;

export const renderHistoryPage = (container) => {
    resetMain();
    createHistory(container);
    renderHistory(container);

    eventManager.add(container, 'click', (event) => {
        if(event.target && event.target.matches('button.updateBtn')){
            const postCard = event.target.closest('li.post-card');
            if(postCard){
                const maxIndex = document.querySelectorAll('.post-card').length;
                const num = maxIndex - postCard.dataset.index - 1;

                renderSettingHistory(container, num);
            }
        }
    });
};


export const renderHistory = async (container) => {

    try{
        const historyData = await (await fetch('http://localhost:3000/data/historyData')).json();

        if(!historyData || historyData.data.length === 0){
            const noneHistoryHTML = document.createElement('p');
            noneHistoryHTML.innerText = 'No history found.';
            container.appendChild(noneHistoryHTML);
            return;
        }

        const historyPostList = document.createElement('ul');
        historyPostList.id = 'post-list';
        historyPostList.className = "scrollable-container";

        let num = 0;
        historyData.data.reverse().forEach(item => {
            const historyPost = document.createElement('li');
            historyPost.dataset.index = num;
            historyPost.className = 'post-card';
            historyPost.innerHTML = `
                <h2>${item.title}</h2>
                <p>${item.description}</p>
                <p>${item.date}</p>
            `;

            const historyUpdateBtn = document.createElement('button');
            historyUpdateBtn.className = 'updateBtn';
            historyUpdateBtn.innerText = '수정';

            historyPost.appendChild(historyUpdateBtn);
            historyPostList.appendChild(historyPost);
            
            num ++;
        });

        container.appendChild(historyPostList);

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

    eventManager.remove(container, 'submit');

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
                        date: formatDate(Date.now()),
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
                    renderHistoryPage(container);
                    document.getElementById("title").value = '';
                    document.getElementById("description").value = '';    
                }
            } catch (error) {
                console.error("에러 발생:", error);
            }    
        }
        
    });
};

export const renderSettingHistory = async (container, index) => {

    // 창 켜짐 확인
    modalPageOn = true;
    console.log(modalPageOn);

    const data = await (await fetch('http://localhost:3000/data/historyData')).json();
    
    const historyItem = data.data[index];

    // dom 요소 추가
    const background = document.createElement('div');
    background.id = 'blurBackground';

    const section = document.createElement('section');
    section.id = 'historySet';

    const itemHeader = document.createElement('div');
    itemHeader.id = 'itemheader';
    itemHeader.innerHTML = `
        <div>
            <h3>History Update</h3>
        </div>
        <div>
            <i class='bx bx-x'></i>
        </div>
    `;

    const itemForm = document.createElement('form');
    itemForm.id = 'historyUpdateForm';
    itemForm.action = 'http://localhost:3000/data/historyData';
    itemForm.method = 'POST';

    const headerInput = document.createElement('input');
    headerInput.type = 'text';
    headerInput.id = 'historyHead';
    headerInput.required = true;
    headerInput.value = historyItem.title;

    const descriptionInput = document.createElement('textarea');
    descriptionInput.id = 'historyDescription';
    descriptionInput.required = true;
    descriptionInput.value = historyItem.description;

    const historySubmitBtn = document.createElement('button');
    historySubmitBtn.type = 'submit';
    historySubmitBtn.innerText = '수정';

    const deleteBtn = document.createElement('button');
    deleteBtn.id = 'itemDelete';
    deleteBtn.innerText = '삭제';
    itemForm.appendChild(deleteBtn);

    itemForm.appendChild(headerInput);
    itemForm.appendChild(descriptionInput);
    itemForm.appendChild(historySubmitBtn);
    


    section.appendChild(itemHeader);
    section.appendChild(itemForm);
    section.appendChild(deleteBtn);

    background.appendChild(section);
    container.appendChild(background);

    eventManager.remove(container, 'click');
    eventManager.remove(container, 'submit');

    eventManager.add(container, 'click', async (event) => {
       if(event.target && event.target.matches('i.bx-x')){
            // 모달 창 꺼짐
            modalPageOn = false;
            // console.log(modalPageOn);

            renderHistoryPage(container);
        }
        // 아이템 삭제
        else if (event.target && event.target.matches("button#itemDelete")){
            try{
                console.log(index);
                await fetch(`http://localhost:3000/data/historyData/${index}`, {
                    method: 'DELETE'
                });
        
                // 모달 창 꺼짐
                modalPageOn = false;
                // console.log(modalPageOn);

                renderHistoryPage(container);
            }
            catch (err) {
                console.err("Error deleting item:", err);
            }
        }
    });


    eventManager.add(container, 'submit', async (event) => {
        if(event.target && event.target.matches("form#historyUpdateForm")){
            event.preventDefault();

            const itemTitle = document.getElementById('historyHead').value;
            const itemDescription = document.getElementById('historyDescription').value;

            try {
                const res = await fetch('http://localhost:3000/data/historyData');
                if(!res.ok){
                    throw new Error("Failed to fetch data");
                }
                const data = await res.json();

                // 데이터 수정 로직
                data[index]['title'] = itemTitle;
                data[index]['description'] = itemDescription;
                

                // 수정된 데이터 보내기
                await fetch('http://localhost:3000/data/historyData', {
                    method: 'PUT',
                    headers: {
                        "Content-Type": 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                console.log("Data updated successfully:", data);
                    
                // 모달 창 꺼짐
                modalPageOn = false;
                // console.log(modalPageOn);

                renderHistoryPage(container);
            } catch (error) {
                console.error("Error updating data :", error);
            }
        }
    });
}