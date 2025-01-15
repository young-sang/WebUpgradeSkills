export const dataFetch = async (path) => {
    const data = await (await fetch('http://localhost:3000/' + path)).json();
    return data.data;
}

