const http = require('http');
const fs = require('fs');
const path = require('path');
const { getJsonData, addJsonData } = require('./js/utils.js');

// const querystring = require('querystring');
// const { json } = require('stream/consumers');

const server = http.createServer((req, res) => {
    // 요청된 파일 경로
    let filePath = '.' + req.url;
    if (filePath == './') {
        filePath = './public/index.html'; // 기본 파일 설정
    } else if (req.url == '/data/postData' && req.method == 'GET'){
        // JSON 데이터 변환
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
    } else if (req.url == '/data/postData' && req.method == 'POST'){
        let body = '';

        // 데이터 수신
        req.on('data', chunk => {
            body += chunk;
        });

        
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

    } else if (req.url == '/data/postData' && req.method == 'PUT') {
        let body = '';

        // 데이터 수신
        req.on('data', chunk => {
            body += chunk;
        });
        
        req.on('end', () => {
            try {
                const updatedPost = JSON.parse(body);
                const JSONfilePath = path.join(__dirname, 'data', 'postData.json');

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
    } else if (req.url.startsWith('/data/postData/') && req.method == 'DELETE') {
        const urlParts = req.url.split('/');
        const id = urlParts[urlParts.length -1];

        const JSONfilePath = path.join(__dirname, "data", 'postData.json');

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
    } else if (req.url == '/data/historyData' && req.method == 'GET') {
        // JSON 데이터 변환
        getJsonData('history.json')
            .then(data => {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(data);
            })
            .catch(error => {
                res.writeHead(500, { 'content-type': 'application/json'});
                res.end(JSON.stringify(error));
            });
        return;
    } else if (req.url == '/data/historyData' && req.method == 'POST') {
        let body = '';

        // 데이터 수신
        req.on('data', chunk => {
            body += chunk;
        });

        
        req.on('end', () => {
            addJsonData(body, 'history.json')
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

    } else if (req.url == '/data/historyData' && req.method == 'PUT') {
        let body = '';

        // 데이터 수신
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const updatedPost = JSON.parse(body);
                const JSONfilePath = path.join(__dirname, 'data', 'history.json');

                // 기존 데이터 읽기
                fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Error reading data', error: err.message }));
                        return;
                    }

                    // 데이터 저장
                    fs.writeFile(JSONfilePath, JSON.stringify(updatedPost, null, 2), 'utf8', (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Error reading data', error: err.message }));
                            return;
                        }

                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({message: 'Invalid JSON data'}));
                    });
                });                
            }
            catch (err) {
                res.writeHead(400, {'content-type': 'application/json'});
                res.end(JSON.stringify({message: 'Invalid JSON data', err}));
            }
        });
        return;
    } else if (req.url.startsWith('/data/historyData/') && req.method == 'DELETE') {
        const urlParts = req.url.split('/');
        const delIndex = urlParts[urlParts.length -1];
        
        const JSONfilePath = path.join(__dirname, "data", 'history.json');

        fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
            if (err) {
                res.writeHead(500, {'content-type': 'application/json'});
                res.end(JSON.stringify({message: 'Error reading data', err}));
                return;
            }

            // 기존 데이터 불러오기
            let item = JSON.parse(jsonData) || [];
            const filtereditems = item.filter((_, index) => index != delIndex);
            

            if(item.length === filtereditems.length){
                res.writeHead(404, {'content-type': 'application/json'});
                res.end(JSON.stringify({message: 'Item not found', err}));
                return;
            }

            // 수정 데이터 저장
            fs.writeFile(JSONfilePath, JSON.stringify(filtereditems, null, 2), 'utf8', (err) => {
                if (err) {
                    res.writeHead(500, {'content-type': 'application/json'});
                    res.end(JSON.stringify({message: 'Error saving data', err}));
                    return;
                }

                res.writeHead(200, {'content-type': 'application/json'});
                res.end(JSON.stringify({message: 'Item deleted successfully'}));
            });
        });
        return;
    } else if (req.url == '/data/optionData' && req.method == 'GET') {
        // JSON 데이터 변환
        getJsonData('options.json')
            .then(data => {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(data);
            })
            .catch(error => {
                res.writeHead(500, { 'content-type': 'application/json'});
                res.end(JSON.stringify(error));
            });
        return;
    } else if (req.url == '/data/optionData' && req.method == 'PUT') {
        let body = '';

        // 데이터 수신
        req.on('data', chunk => {
            body += chunk;
        });
        
        req.on('end', () => {
            const { itemMode, data} = JSON.parse(body);

            // 파일 경로 설정
            const JSONfilePath = path.join(__dirname, "data", "options.json");

            // 기존 데이터 읽기
            fs.readFile(JSONfilePath, "utf8", (err, jsonData) => {
                if(err){
                    res.writeHead(500, {"content-type": "application/json"});
                    res.end(JSON.stringify({message: "Error reading data", err}));
                    return;
                }

                // 데이터 업데이트
                const parsedData = JSON.parse(jsonData);
                parsedData[itemMode] = data;

                // 업데이트된 데이터 저장
                fs.writeFile(JSONfilePath, JSON.stringify(parsedData, null, 2), "utf-8", (err) => {
                    if (err) {
                        res.writeHead(500, {"content-type": "application/json"});
                        res.end(JSON.stringify({message: "Error saving data", err}));
                        return;
                    }

                    res.writeHead(200, {"content-type": "application/json"});
                    res.end(JSON.stringify({message: "Data updated successfully"}));
                    return;
                })
            })
        
        })
        return;
    } else if (req.url.startsWith('/data/optionData/')  && req.method == 'DELETE') {
        const urlParts = req.url.split('/');
        const itemMode = urlParts[urlParts.length - 2];
        const delIndex = urlParts[urlParts.length - 1];

        const JSONfilePath = path.join(__dirname, "data", "options.json");

        fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
            if (err) {
                res.writeHead(500, {'content-type': 'application/json'});
                res.end(JSON.stringify({message: 'Error reading data', err}));
                return;
            }

            // 기존 데이터 불러오기
            let item = JSON.parse(jsonData) || [];
            const filtereditemsMode = item[itemMode].filter((_, index) => index != delIndex);
            
            if(item[itemMode].length === filtereditemsMode.length){
                res.writeHead(404, {'content-type': 'application/json'});
                res.end(JSON.stringify({message: 'Item not found', err}));
                return;
            }

            item[itemMode] = filtereditemsMode;
            const filtereditems = item;

            // 수정 데이터 저장
            fs.writeFile(JSONfilePath, JSON.stringify(filtereditems, null, 2), 'utf8', (err) => {
                if (err) {
                    res.writeHead(500, {'content-type': 'application/json'});
                    res.end(JSON.stringify({message: 'Error saving data', err}));
                    return;
                }

                res.writeHead(200, {'content-type': 'application/json'});
                res.end(JSON.stringify({message: 'Item deleted successfully'}));
            });
        });
        return;
    } else if (req.url == '/data/optionData' && req.method == 'GET') {

    }else {
        filePath = './public' + req.url; // public 폴더 내의 파일
    }

    // 파일 확장자 추출
    const extname = String(path.extname(filePath)).toLowerCase();

    // MIME 타입 설정
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';
    sendFile(filePath, contentType, res);
});

function sendFile(filePath, contentType, res){
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
        } else {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error reading file');
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(data);
                }
            });
        }
    });
}


// 서버 포트 설정
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
