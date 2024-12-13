export const renderFooter = (container) => {
    if(container){
        container.innerHTML = `
            <h2>Posts</h2>
            <ul>
                <li>Post 1</li>
                <li>Post 2</li>
                <li>Post 3</li>
            </ul>
        `;
    }
};