const http = require('http');
const fs = require('fs');
const path = require('path');
const postDataHandler = require('./routes/postData.js');
const historyDataHandler = require('./routes/historyData.js');
const optionDataHandler = require('./routes/optionData.js');
const { sendErrorResponse, sendSuccessResponse } = require('./js/utils.js');

// const querystring = require('querystring');
// const { json } = require('stream/consumers');

const server = http.createServer((req, res) => {
    // 요청된 파일 경로
    let filePath = '.' + req.url;

    if (filePath == './') {
        filePath = './public/index.html'; // 기본 파일 설정
    } else if (req.url.startsWith('/data/postData/') && req.method == 'DELETE') {
        postDataHandler(req, res);
        return;
    } else if (req.url === '/data/postData') {
        postDataHandler(req, res);
        return;
    } else if (req.url.startsWith('/data/historyData/') && req.method == 'DELETE') {
        historyDataHandler(req, res);
        return;
    } else if (req.url == '/data/historyData') {
        historyDataHandler(req, res);
        return;
    } else if (req.url.startsWith('/data/optionData/') && req.method == 'DELETE') {
        optionDataHandler(req, res);
        return;
    } else if (req.url == '/data/optionData') {
        optionDataHandler(req, res);
        return;
    } else {
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


function sendFile(filePath, contentType, res) {
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            sendErrorResponse(res, 404, err);
            return;
        }

        // 파일이 있을 경우
        fs.readFile(filePath, (err, data) => {
            if (err) {
                // 파일 읽기 에러 발생 시
                sendErrorResponse(res, 500, err);
                return;
            }

            // 정상적인 경우
            sendSuccessResponse(res, 200, data);
        });
    });
}


// 서버 포트 설정
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
