import { eventManager, resetMain } from "../utils.js"

export const renderOptionPage = (container) => {
    resetMain();
    renderItems(container, "tags");
    renderItems(container, "category");
    // renderSettingItems(container, "tags");
    renderVisualMode(container);


    eventManager.add(container, 'click', (event) => {
        if(event.target.tagName === "LI"){
            const section = event.target.closest('section');
            const itemKey = section ? section.id.split('-')[0] : null;
            if(itemKey){
                const num = event.target.dataset.index;
                const text = event.target.innerText;
                
                renderSettingItems(container, itemKey, "update", num, text);
            }
        }
        else if (event.target && event.target.matches("button.btnItemAdd")){
            const section = event.target.closest('section');
            const itemKey = section ? section.id.split('-')[0] : null;
            if(itemKey){
                const text = event.target.innerText;
                
                renderSettingItems(container, itemKey, "create", -1, 'new');
            }
        }
    });


};

export const renderItems = async (container, itemKey) => {
    try{
        const data = await (await fetch('http://localhost:3000/data/optionData')).json();
        const tags = data[itemKey];

        if (!tags || tags.length === 0) {
            container.innerHTML += `<p>No items found for ${itemKey}.</p>`;
            return;
        }

        const itemListSection = document.createElement('section');
        itemListSection.id = itemKey + "-items";
        itemListSection.className = "option-Items";

        const itemHeader = document.createElement('h3');
        itemHeader.innerText = itemKey;
        
        const itemUL = document.createElement('ul');
        itemUL.className = "OptionItemList";
        
        let num = 0;
        tags.forEach(item => {
            const itemList = document.createElement('li');
            itemList.className = 'optionItem';
            itemList.dataset.index = num;
            itemList.innerText = item;
            itemUL.appendChild(itemList);
            num ++;
        });

        const addItemBtn = document.createElement('button');
        addItemBtn.className = 'btnItemAdd';
        addItemBtn.innerText = '+';

        itemListSection.appendChild(itemHeader);
        itemListSection.appendChild(itemUL);
        itemListSection.appendChild(addItemBtn);
        container.appendChild(itemListSection);
        
    }
    catch(error){
        console.error(error);
    }
};

export const renderSettingItems = (container, itemMode, mode, index, text) => {
    const background = document.createElement('div');
    background.id = 'blurBackground';

    const section = document.createElement("section");
    section.id = "optionItemSet";
    section.innerHTML = `
        <div>
            <h3>${itemMode}Name:${mode}</h3>
            <h3>${text}</h3>
            
        </div>
        <form id="optionItemForm" action="http://localhost:3000/data/optionData" method="POST">
            <input type="text" id="item" required />
            <button type="submit">제출</button>
        </form>
    `;

    // 이미 존재한다면 삭제 후 생성
    const existingForm = document.getElementById("optionItemSet");
    if(existingForm){
        existingForm.remove();
    }

    // 요소 추가
    background.appendChild(section);
    container.appendChild(background);
    

    eventManager.remove(container, 'submit');

    eventManager.add(container, 'submit', async (event) => {
        if(event.target && event.target.matches("form#optionItemForm")){
            event.preventDefault();
            
            const item = document.getElementById('item').value;
            console.log(index);
            
            try {
                const res = await fetch('http://localhost:3000/data/optionData');
                if(!res.ok){
                    throw new Error("Failed to fetch data");
                }
                const data = await res.json();

                // 데이터 수정 로직
                if(index === -1) {
                    data[itemMode].push(item);
                } else {
                    data[itemMode][index] = item;
                }
                console.log(data);

                // 수정된 데이터 보내기
                await fetch('http://localhost:3000/data/optionData', {
                    method: 'PUT',
                    headers: {
                        "Content-Type": 'application/json',
                    },
                    body: JSON.stringify({
                        itemMode,
                        data: data[itemMode],
                    }),
                });
                console.log("Data updated successfully:", data);
            } catch (error) {
                console.error("Error updating data :", error);
            }
            
            renderOptionPage(container);
        }
    });
}

export const renderVisualMode = async (container) => {
    // const themes = ['light', 'dark', 'blue', 'green'];
    const data = await (await fetch('http://localhost:3000/data/optionData')).json();
    const themes = data.color;
    let currentThemeIndex = 0;

    const section = document.createElement("section");
    section.id = "setColor";
    section.innerHTML = `
        <button id="color-btn">색 변경</button>
    `;

    container.appendChild(section);

    container.addEventListener('click', (event) => {
        if(event.target && event.target.matches("#color-btn")){            
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            document.documentElement.setAttribute('data-theme', themes[currentThemeIndex]);
        }
        
    });
}