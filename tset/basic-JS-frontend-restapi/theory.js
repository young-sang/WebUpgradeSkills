// // get 예제
// fetch('https://jsonplaceholder.typicode.com/posts')
//     .then(res => {
//         if(!res.ok){
//             throw new Error(`HTTP error! status : ${res.status}`);
//         }
//         return res.json();
//     })
//     .then(data => {
//         console.log(data);
//     })
//     .catch(error => {
//         console.error(`Error : `, error);
//     })

// // post 예제

fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
        "Content-Type": 'application/json',
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