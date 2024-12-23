const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    
    // 요청된 파일 경로
    let filePath = '.' + req.url;

    if (req.url == '/') {
        filePath = './public/index.html'; // 기본 파일 설정
    } else if (req.url == '/postData' && req.method == 'GET'){
        // JSON 데이터 변환
        const filePath = path.join(__dirnamem, "data", 'postData.json');
        fs.readFile(filePath, 'utf-8', (err,data) => {
            if(err){
                res.writeHead(500, { 'content-type': 'application/json'});
                res.end(JSON.stringify({error: 'Failed to read the file'}));
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);
        });
    } else {
        filePath = './public' + req.url; // public 폴더 내의 파일

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
    }    
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
