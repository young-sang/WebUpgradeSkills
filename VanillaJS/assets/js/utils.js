export const createElement = (tag, attributes = {}, children = {}) => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    children.forEach(child => element.appendChild(typeof child === 'string' ? document.createTextNode(child) : child));
    return element;
};

export const resetMain = () => {
    document.getElementById('app-content').innerHTML = '';
}