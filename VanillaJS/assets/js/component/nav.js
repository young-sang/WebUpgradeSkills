import { renderHistoryPage } from './history.js';
import { renderCreatePostForm, renderPostsPage } from './posts.js';

export const renderNav = (container) => {

    const navItems = ["Posts", "Write", "History", "Options"];

    const mainContainer = document.getElementById("app-content");

    var navItemsHTML = '';
    navItems.forEach(navItem => {
        navItemsHTML += `<li class="item">${navItem}</li>`
    });

    const nav = `
        <ul class="items">
            ${navItemsHTML}
        </ul>
    `;

    container.innerHTML += nav;

    const navList = document.querySelectorAll(".item");
    navList.forEach(item => {
        item.addEventListener('click', (event) => {
            const itemText = event.target.innerText;
            switch(itemText){
                case "Posts":
                    renderPostsPage(mainContainer);
                    break;
                case "Write":
                    renderCreatePostForm(mainContainer);
                    break;
                case "History":
                    renderHistoryPage(mainContainer);
                    break;
                case "Options":
                    break;
            }
        });
    });
    
};