import { renderHeader } from './component/header.js';
import { renderFooter } from './component/footer.js';
// import { renderPosts } from './component/posts.js';
import { renderMain } from './component/main.js';

const initApp = () => {
    renderHeader(document.getElementById('app-header'));
    renderMain(document.getElementById('app-content'));
    renderFooter(document.getElementById('app-footer'));
};

document.addEventListener('DOMContentLoaded', initApp);