export const renderNav = (container) => {

    const navItems = ["a", "b", "c"];

    var navItemsHTML = '';
    navItems.forEach(navItem => {
        navItemsHTML += `<li id="item">${navItem}</li>`
    });

    const nav = `
        <nav id="app-nav">
            <ul class="items">
                ${navItemsHTML}
            </ul>
        </nav>
    `;
    
    container.innerHTML += nav;
    console.log(container.innerHTML);
};