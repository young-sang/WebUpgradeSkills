const fs = require('fs');
const path = require('path');
const { getJsonData, addJsonData } = require('../js/utils');

const historyDataHandler = (req, res) => {
    if (req.method == 'GET') {
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
    } 
    else if (req.method == 'POST') {
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

    } 
    else if (req.method == 'PUT') {
        let body = '';

        // 데이터 수신
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const updatedPost = JSON.parse(body);
                const JSONfilePath = path.join(__dirname, '../data', 'history.json');

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
    } 
    else if (req.method == 'DELETE') {
        const urlParts = req.url.split('/');
        const delIndex = urlParts[urlParts.length -1];
        
        const JSONfilePath = path.join(__dirname, "../data", 'history.json');

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
    }
};

module.exports = historyDataHandler;