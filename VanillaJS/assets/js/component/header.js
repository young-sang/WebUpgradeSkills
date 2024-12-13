import { renderMain } from './main.js';
import { renderNav } from './nav.js';

export const renderHeader = (container) => {


    const headerTitle = `
        <h1 id="toMain">Welcome to My App</h1>
        <i id="navIcon" class='bx bx-menu'></i>
    `;


    if(container) {
        container.innerHTML += headerTitle;
        renderNav(container);
        
    }

    const backToMain = document.getElementById("toMain");
    const toggleNav = document.getElementById("navIcon");

    backToMain.addEventListener('click', () => {
        renderMain(document.getElementById('app-content'));
    });
    
    toggleNav.addEventListener('click', () => {
        const navWindow = document.getElementById("app-nav");
        navWindow.classList.toggle("visible");
    });
};