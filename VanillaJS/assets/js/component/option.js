import { resetMain } from "../utils.js"

export const renderOptionPage = (container) => {
    resetMain();
    renderItems(container, "tags");
    renderItems(container, "category");
};

export const renderItems = async (container, itemKey) => {
    try{
        const data = await axios.get('./data/options.json');
        const tags = data.data[itemKey];
        const tagsHTML = tags.map(tag => `
            <li class="tag-card">
            ${tag}
            </li>
        `).join('');

        container.innerHTML += `
            <section id="tag-section">
                <h3>${itemKey}</h3>
                <ul id="tagList">
                ${tagsHTML}
                </ul>
            </section>
        `;
        // 온 클릭으로 창 띄워서 업데이트 가능하도록 
        // 마지막에 플러스 버튼 누르면 추가 가능하도록

    }
    catch(error){
        console.error(error);
    }
};



export const visualMode = () => {
    
}