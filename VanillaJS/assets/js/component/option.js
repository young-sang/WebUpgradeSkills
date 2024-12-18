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
                const text = event.target.innerText;
                
                renderSettingItems(container, itemKey, "update");
            }
        }
        else if (event.target && event.target.matches("button.btnItemAdd")){
            const section = event.target.closest('section');
            const itemKey = section ? section.id.split('-')[0] : null;
            if(itemKey){
                const text = event.target.innerText;
                
                renderSettingItems(container, itemKey, "create");
            }
        }
    });

    eventManager.add(container, 'submit', (event) => {
        if(event.target && event.target.matches("form#optionItemForm")){
            event.preventDefault();
            event.target.parentElement.remove();
        }
    });
};

export const renderItems = async (container, itemKey) => {
    try{
        const data = await axios.get('./data/options.json');
        const tags = data.data[itemKey];

        if (!tags || tags.length === 0) {
            container.innerHTML += `<p>No items found for ${itemKey}.</p>`;
            return;
        }
        
        const tagsHTML = tags.map(tag => `
            <li class="optionItem">
            ${tag}
            </li>
        `).join('');

        container.innerHTML += `
            <section id="${itemKey}-items" class="option-Items">
                <h3>${itemKey}</h3>
                <ul class="OptionItemList">
                ${tagsHTML}
                </ul>
                <button class="btnItemAdd">+</button>
            </section>
        `;       
        
    }
    catch(error){
        console.error(error);
    }
};

export const renderSettingItems = (container, itemMode, mode) => {
    const section = document.createElement("section");
    section.id = "optionItemSet";
    section.innerHTML = `
        <h3>${itemMode}:${mode}</h3>
        <form id="optionItemForm">
            <input type="text">
            <button type="submit">제출</button>
        </form>
    `;

    // 이미 존재한다면 삭제 후 생성
    const existingForm = document.getElementById("optionItemSet");
    if(existingForm){
        existingForm.remove();
    }

    container.appendChild(section);

    if(mode == "create"){
        // 위 OptionItemList의 마지막에 추가
    }
    else if(mode == "update"){
        // 변경
    }

    
}

export const renderVisualMode = async (container) => {
    // const themes = ['light', 'dark', 'blue', 'green'];
    const data = await axios.get('./data/options.json');
    const themes = data.data.color;
    let currentThemeIndex = 0;
    console.log(themes);

    const section = document.createElement("section");
    section.id = "setColor";
    section.innerHTML = `
        <button id="color-btn">색 변경</button>
    `;

    container.appendChild(section);

    container.addEventListener('click', (event) => {
        if(event.target && event.target.matches("#color-btn")){
            console.log(1);
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            console.log(themes)
            document.documentElement.setAttribute('data-theme', themes[currentThemeIndex]);
        }
        
    });
}