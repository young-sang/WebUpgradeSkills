const fs = require('fs');
const path = require('path');
const { getJsonData, addJsonData } = require('../js/utils');

const postDataHandler = (req, res) => {
    if(req.method === 'GET'){
        getJsonData('postData.json')
            .then(data => {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(data);
            })
            .catch(error => {
                res.writeHead(500, { 'content-type': 'application/json'});
                res.end(JSON.stringify(error));
            });
        return;
    }
    else if (req.method === 'POST'){
        let body = '';
        
        // 데이터 수신
        req.on('data', chunk => body += chunk);
        
        req.on('end', () => {
            addJsonData(body, 'postData.json')
                .then(() => {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({message: 'Data added successfull'}));
                })
                .catch(() => {
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({message: 'Error saving Data'}));
                });
        })
        return;
    }
    else if (req.method === "PUT"){
         let body = '';
        
        // 데이터 수신
        req.on('data', chunk => {
            body += chunk;
        });
        
        req.on('end', () => {
            try {
                const updatedPost = JSON.parse(body);
                const JSONfilePath = path.join(__dirname, '../data', 'postData.json');

                // 기존 데이터 읽기
                fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Error reading data', error: err.message }));
                        return;
                    }

                    const posts = JSON.parse(jsonData) || [];
                    const postIndex = posts.findIndex((post) => post.id == updatedPost.id);

                    if(postIndex === -1){
                        res.writeHead(404, {"Content-Type": 'application/json'});
                        res.end(JSON.stringify({message: "Post not found"}));
                        return;
                    }

                    // 기존 데이터 수정
                    posts[postIndex] = {...posts[postIndex], ...updatedPost};

                    // 데이터 저장
                    fs.writeFile(JSONfilePath, JSON.stringify(posts, null, 2), 'utf8', (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Error reading data', error: err.message }));
                            return;
                        }

                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({message: 'Invalid JSON data', err}))
                    });
                });
            } catch (err) {
                res.writeHead(400, {'content-type': 'application/json'});
                res.end(JSON.stringify({message: 'Invalid JSON data', err}));
            }        
        });
        return;
    }
    else if (req.method === "DELETE"){
        const urlParts = req.url.split('/');
        const id = urlParts[urlParts.length -1];

        const JSONfilePath = path.join(__dirname, "../data", 'postData.json');

        fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
            if (err) {
                res.writeHead(500, {'content-type': 'application/json'});
                res.end(JSON.stringify({message: 'Error reading data', err}));
                return;
            }

            // 기존 데이터 불러오기
            let posts = JSON.parse(jsonData) || [];
            const filteredPosts = posts.filter((post) => post.id != Number(id));

            if(posts.length === filteredPosts.length){
                res.writeHead(404, {'content-type': 'application/json'});
                res.end(JSON.stringify({message: 'Post not found', err}));
                return;
            }

            // 수정 데이터 저장
            fs.writeFile(JSONfilePath, JSON.stringify(filteredPosts, null, 2), 'utf8', (err) => {
                if (err) {
                    res.writeHead(500, {'content-type': 'application/json'});
                    res.end(JSON.stringify({message: 'Error saving data', err}));
                    return;
                }

                res.writeHead(200, {'content-type': 'application/json'});
                res.end(JSON.stringify({message: 'Post deleted successfully'}));
            });
        });
        return;
    }
};

module.exports = postDataHandler;