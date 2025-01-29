export const dataFetch = async (path) => {
    const data = await (await fetch('http://localhost:3000/' + path)).json();
    return data.data;
}


export const handelPut = async (newData, path, afterPut = () => {}) => {
    try {
        const url = `http://localhost:3000/data/` + path;
        const method = 'PUT';

        await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        });
        afterPut();
    }
    catch (err) {
        console.error(err);
    }
}

export const handleDelete = async (path, afterDelete = () => {}) => {
    try {
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
