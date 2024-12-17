import { resetMain } from "../utils.js"

export const renderOptionPage = (container) => {
    resetMain();
    renderItems(container, "tags");
    renderItems(container, "category");
    // renderSettingItems(container, "tags");

    container.addEventListener('click', (event) => {
        if(event.target.tagName === "LI"){
            const section = event.target.closest('section');
            const itemKey = section ? section.id.split('-')[0] : null;
            if(itemKey){
                const text = event.target.innerText;
                console.log(text);
                renderSettingItems(container, itemKey);
            }
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
            <section id="${itemKey}-items">
                <h3>${itemKey}</h3>
                <ul class="OptionItemList">
                ${tagsHTML}
                </ul>
            </section>
        `;       
        
    }
    catch(error){
        console.error(error);
    }
};

export const renderSettingItems = (container, mode) => {
    const section = document.createElement("section");
    section.id = "optionItemSet";
    section.innerHTML = `
        <h3>${mode}</h3>
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

    container.addEventListener('submit', (event) => {
        if(event.target && event.target.matches("form#optionItemform")){
            event.preventDefault();
            console.log(1);
        }
    });
}

export const visualMode = () => {
    
}