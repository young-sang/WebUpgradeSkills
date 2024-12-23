const http = require('http');
const fs = require('fs');
const path = require('path');

// 요청을 처리하는 함수
const requestHandler = (req, res) => {
  // 정적 파일 제공 (예: HTML, CSS, JS)
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(data);
    });
  } else if (req.url === '/api/data') {
    // 예시로 JSON 데이터 응답
    const data = { message: 'Hello from the server!' };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};

// 서버 생성
const server = http.createServer(requestHandler);

// 서버 리스닝
server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
