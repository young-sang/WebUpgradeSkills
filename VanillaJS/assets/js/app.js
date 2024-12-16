import { renderHeader } from './component/header.js';
import { renderFooter } from './component/footer.js';
import { renderPostsPage } from './component/posts.js';
// import { renderNav } from './component/nav.js';

const initApp = () => {
    renderHeader(document.getElementById('app-header'));
    // renderNav(document.getElementById('app-nav'));
    renderPostsPage(document.getElementById('app-content'));
    renderFooter(document.getElementById('app-footer'));
};

document.addEventListener('DOMContentLoaded', initApp);