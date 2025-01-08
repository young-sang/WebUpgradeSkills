const fs = require('fs');
const path = require('path');
const { getJsonData, addJsonData, updateData, deleteData } = require('../js/utils');

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
            updateData(req, res, body, 'options.json');
        })
        return;
    } 
    else if (req.method == 'DELETE') {
        deleteData(req, res, 'options.json');
        return;
    }
};

module.exports = optionDataHandler;