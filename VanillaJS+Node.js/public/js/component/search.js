export const renderSearhForm = (container) => {
    const searchForm = `
        <form class="search-bar">
            <input type="text" placeholder="Search posts...">
            <button type="submit">검색</button>
        </form>
    `;

    container.innerHTML += searchForm;
}