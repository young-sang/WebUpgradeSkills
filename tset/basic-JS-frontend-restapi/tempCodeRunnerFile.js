fetch(`https://jsonplaceholder.typicode.com/posts`, {
    mathod: 'POST',
    headers: {
        "Content-Type": 'applications/json',
    },
    body: JSON.stringify({
        title: `foo`,
        body: 'bar',
        userId: 1,
    }),
})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.error(`Error: `, error));