import { eventManager, resetMain } from "../utils.js"

let modalPageOn = false;

export const renderOptionPage = (container) => {
    resetMain();
    renderItems(container, "tags");
    renderItems(container, "category");
    // renderSettingItems(container, "tags");
    renderVisualMode(container);


    eventManager.add(container, 'click', (event) => {
        
        if(modalPageOn){
            // console.log("modalPageOn");
            return;
        }

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
    
    // 창 켜짐 확인
    modalPageOn = true;
    // console.log(modalPageOn);

    // dom 요소 추가
    const background = document.createElement('div');
    background.id = 'blurBackground';

    const section = document.createElement("section");
    section.id = "optionItemSet";

    const itemHeader = document.createElement('div');
    itemHeader.id = 'itemheader';
    itemHeader.innerHTML = `
        <div>
            <h3>${itemMode}Name:${mode}</h3>
            <h3>${text}</h3>
        </div>
        <div>
            <i class='bx bx-x'></i>
        </div>
    `;

    const itemForm = document.createElement('form');
    itemForm.id = 'optionItemForm';
    itemForm.action = 'http://localhost:3000/data/optionData';
    itemForm.method = 'POST';
    

    const itemInput = document.createElement('input');
    itemInput.type = 'text';
    itemInput.id = 'item';
    itemInput.required = true;
    
    if(text != 'new'){
        itemInput.value = text;
    }

    const itemSubmitBtn = document.createElement('button');
    itemSubmitBtn.type = 'submit';
    itemSubmitBtn.innerText = '제출';

    
    // 이미 존재한다면 삭제 후 생성
    const existingForm = document.getElementById("optionItemSet");
    if(existingForm){
        existingForm.remove();
    }

    

    itemForm.appendChild(itemInput);
    itemForm.appendChild(itemSubmitBtn);

    section.appendChild(itemHeader);
    section.appendChild(itemForm);


    // 아이템 삭제 기능
    if (mode === 'update'){
        const deleteBtn = document.createElement('button');
        deleteBtn.id = 'itemDelete';
        deleteBtn.innerText = '삭제';
        section.appendChild(deleteBtn);
    }


    // 요소 추가
    background.appendChild(section);
    container.appendChild(background);
    

    eventManager.remove(container, 'submit');
    eventManager.remove(container, 'click');

    eventManager.add(container, 'click', async (event) => {
        if(event.target && event.target.matches('i.bx-x')){
            // 모달 창 꺼짐
            modalPageOn = false;
            // console.log(modalPageOn);

            renderOptionPage(container);
        }
        // 아이템 삭제
        else if (event.target && event.target.matches("button#itemDelete")){
            // console.log('delete');
            
            // 모달 창 꺼짐
            modalPageOn = false;
            // console.log(modalPageOn);

            if(itemMode && index){
                try{
                    await fetch(`http://localhost:3000/data/optionData/${itemMode}/${index}`, {
                        method: 'DELETE'
                    });
                    resetMain();
                    renderOptionPage(container);
                }
                catch (err) {
                    console.err("Error deleting item:", err);
                }
            }
        }
    });

    eventManager.add(container, 'submit', async (event) => {
        if(event.target && event.target.matches("form#optionItemForm")){
            event.preventDefault();
            
            // 모달 창 꺼짐
            modalPageOn = false;
            // console.log(modalPageOn);

            const item = document.getElementById('item').value;
            
            
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
                // console.log(data);

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

                renderOptionPage(container);
            } catch (error) {
                console.error("Error updating data :", error);
            }
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