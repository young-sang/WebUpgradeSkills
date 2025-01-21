export const dataFetch = async (path) => {
    const data = await (await fetch('http://localhost:3000/' + path)).json();
    return data.data;
}

export const handleDelete = async (path, afterDelete = () => {}) => {
    try {
        console.log(path);
        const url = `http://localhost:3000/data/` + path;
        const method = 'DELETE';
        const deleteData = async () => {
            await fetch(url, {
                method,
            });
        };
        deleteData();
        afterDelete();
    }
    catch (err) {
        console.error(err);
    }
}