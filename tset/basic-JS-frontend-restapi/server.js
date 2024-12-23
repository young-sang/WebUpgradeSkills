const http = require('http');
const fs = require('fs');

const PORT = 3000;
const DATA_FILE = './data.json';

const handleRequest = (req, res) => {
  const { method, url } = req;

  if (url === '/api/data') {
    if (method === 'GET') {
      fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Failed to read data' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      });
    } else if (method === 'POST') {
      let body = '';
      req.on('data', chunk => (body += chunk));
      req.on('end', () => {
        const newData = JSON.parse(body);
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
          const jsonData = err ? [] : JSON.parse(data);
          jsonData.push(newData);
          fs.writeFile(DATA_FILE, JSON.stringify(jsonData), 'utf8', writeErr => {
            if (writeErr) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: 'Failed to save data' }));
            }
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newData));
          });
        });
      });
    }
    // Add PUT and DELETE methods similarly
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
};

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
