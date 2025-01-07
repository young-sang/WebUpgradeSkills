const fs = require('fs');
const path = require('path');
const { getJsonData, addJsonData } = require('../js/utils');

const optionDataHandler = (req, res) => {
    if (req.method == 'GET') {
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
    } 
    else if (req.method == 'PUT') {
        let body = '';
        
        // 데이터 수신
        req.on('data', chunk => {
            body += chunk;
        });
        
        req.on('end', () => {
            const { itemMode, data} = JSON.parse(body);
            // console.log(data);

            // 파일 경로 설정
            const JSONfilePath = path.join(__dirname, "../data", "options.json");

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

                // console.log(parsedData);

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
    } 
    else if (req.method == 'DELETE') {
        const urlParts = req.url.split('/');
        const itemMode = urlParts[urlParts.length - 2];
        const delIndex = urlParts[urlParts.length - 1];

        const JSONfilePath = path.join(__dirname, "../data", "options.json");

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
    } 
};

module.exports = optionDataHandler;