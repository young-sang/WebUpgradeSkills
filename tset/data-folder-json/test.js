// JSON 데이터
const posts = [
    { id: 1, title: "Post 1", category: "JS", tag: "", content: "This is the first post" },
    { id: 2, title: "Post 2", category: "JS", tag: "", content: "This is the second post" },
    { id: 3, title: "Post 3", category: "JS", tag: "", content: "This is the third post" },
    { id: 4, title: "Post 4", category: "HTML", tag: "", content: "This is an HTML post" }
];

// 그룹화 함수
function groupByCategory(posts) {
    return posts.reduce((acc, post) => {
        if (!acc[post.category]) {
            acc[post.category] = [];
        }
        acc[post.category].push(post);
        return acc;
    }, {});
}

// 그룹화 결과
const groupedPosts = groupByCategory(posts);
console.log(groupedPosts);
/* 출력:
{
    JS: [
        { id: 1, title: "Post 1", ... },
        { id: 2, title: "Post 2", ... },
        { id: 3, title: "Post 3", ... }
    ],
    HTML: [
        { id: 4, title: "Post 4", ... }
    ]
}
*/
