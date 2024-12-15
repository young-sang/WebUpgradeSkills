import { renderMain } from './Main.js';
import { renderNav } from './nav.js';

export const renderHeader = (container) => {


    const headerTitle = `
        <h1 id="toMain">Welcome to My App</h1>
        <nav id="app-nav"></nav>
    `;


    if(container) {
        container.innerHTML += headerTitle;     
        renderNav(document.getElementById("app-nav"));
    }

    const backToMain = document.getElementById("toMain");
    const toggleNav = document.getElementById("navIcon");

    backToMain.addEventListener('click', () => {
        renderMain(document.getElementById('app-content'));
    });
    
    // toggleNav.addEventListener('click', () => {
    //     const navWindow = document.getElementById("app-nav");
    //     navWindow.classList.toggle("visible");
    // });
};
