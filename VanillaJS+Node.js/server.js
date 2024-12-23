const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const { json } = require('stream/consumers');

const server = http.createServer((req, res) => {
    // 요청된 파일 경로
    let filePath = '.' + req.url;
    if (filePath == './') {
        filePath = './public/index.html'; // 기본 파일 설정
    } else if (req.url == '/postData' && req.method == 'GET'){
        // JSON 데이터 변환
        const JSONfilePath = path.join(__dirname, "data", 'postData.json');
        fs.readFile(JSONfilePath, 'utf-8', (err,data) => {
            if(err){
                res.writeHead(500, { 'content-type': 'application/json'});
                res.end(JSON.stringify({error: 'Failed to read the file'}));
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);
        });
        return;
    } else if (req.url == '/postData' && req.method == 'POST'){
        let body = '';

        // 데이터 수신
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body); // 파싱
                const JSONfilePath = path.join(__dirname, "data", 'postData.json');

                //기존 JSON 데이터 읽기
                fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
                    if (err){
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({message: 'Error reading Data', err}));
                        return;
                    }

                    // 기존 데이터 파싱 후 새로운 데이터 추가
                    const parsedData = JSON.parse(jsonData);
                    parsedData.push(data);

                    // 수정된 데이터 다시 저장
                    fs.writeFile(JSONfilePath, JSON.stringify(parsedData, null, 2), 'utf8', (err) => {
                        if(err){
                            res.writeHead(500, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({message: 'Error saving Data', err}));
                            return;
                        }

                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({message: 'Data added successfull'}));
                    });
                });
            } catch (err) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Invalid JSON format'}));
            }
        });
        return;
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
