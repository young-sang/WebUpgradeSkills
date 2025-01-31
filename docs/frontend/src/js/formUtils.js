export const handleChange = (setter) => (e) => {
    const {name, value} = e.target;
    setter((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};

export const handleSubmit = ( newData, path, mode, afterSubmit = () => {} ) => async (e) => {
    e.preventDefault();    
    
    try{
        const url = `http://localhost:3000/data/${path}`;
        const method = mode === "create" ? 'POST' : 'PUT';

        await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        });

        afterSubmit(newData);
    }
    catch (err) {
        console.error(err);
    }
}

export const handleCompare = ( type, compareData, path, afterCompare = () => {} ) => async (e) => {
    e.preventDefault();    

    try{
        const url = `http://localhost:3000/data/${path}`;
        const method = "POST"

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                compareData,
                searchType: type,
            }),
        });

        const resData = await res.json();
        afterCompare(resData);
    }
    catch (err) {
        console.error(err);
    }
}