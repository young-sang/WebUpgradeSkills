import { resetMain } from "../utils.js"

export const renderOptionPage = (container) => {
    resetMain();
    renderItems(container, "tags");
    renderItems(container, "category");
    // renderSettingItems(container, "tags");
};

export const renderItems = async (container, itemKey) => {
    try{
        const data = await axios.get('./data/options.json');
        const tags = data.data[itemKey];
        const tagsHTML = tags.map(tag => `
            <li class="item">
            ${tag}
            </li>
        `).join('');

        container.innerHTML += `
            <section id="item-section">
                <h3>${itemKey}</h3>
                <ul id="itemList">
                ${tagsHTML}
                </ul>
            </section>
        `;
        // 온 클릭으로 창 띄워서 업데이트 가능하도록 
        // 마지막에 플러스 버튼 누르면 추가 가능하도록

        const items = document.querySelectorAll(".item");
        
        console.log(itemKey);
        items.forEach(item => {
            item.addEventListener('click', (event) => {
                
                const text = event.target.innerText;
                
                renderSettingItems(container, itemKey);

            })  
        });
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

    const existingForm = document.getElementById("optionItemSet");
    if(existingForm){
        existingForm.remove();
    }

    container.appendChild(section);

    // 기존 이벤트 제거 후 폼에 이벤트 추가
    const form = document.getElementById("optionItemForm");
    if (form) {
        form.addEventListener('submit', (event) => handleFormSubmit(event));
    }
}

const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = document.getElementById('optionItemSet');
    if(form){
        form.remove();
        renderOptionPage(document.getElementById('app-content'));
    }
}

export const visualMode = () => {
    
}