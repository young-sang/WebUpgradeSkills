export const dataFetch = async (path) => {
    const data = await (await fetch('http://localhost:3000/' + path)).json();
    return data.data;
}

export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};