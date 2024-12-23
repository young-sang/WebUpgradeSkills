const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('홈 페이지');
    } else if (req.url === '/about' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('소개 페이지');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('페이지를 찾을 수 없습니다.');
    }
});

server.listen(3000, () => {
    console.log('서버가 3000번 포트에서 실행 중입니다.');
});