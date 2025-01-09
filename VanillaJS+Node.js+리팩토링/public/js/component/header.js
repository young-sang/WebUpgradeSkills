import { resetMain } from '../utils.js';
import { renderNav } from './nav.js';
import { renderPostsPage } from './posts.js';

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

    backToMain.addEventListener('click', () => {
        resetMain();
        renderPostsPage(document.getElementById('app-content'));
    });
};
