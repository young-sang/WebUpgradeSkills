const fs = require('fs');
const path = require('path');
const { sendErrorResponse, sendSuccessResponse } = require('./utils');

const DATA_MODE = ['optionData.json', 'historyData.json', 'postData.json'];

// 데이터 가져오기
exports.getJsonData = (req, res, JSONfilePath)  => {

    fs.readFile(JSONfilePath, 'utf8', (err, data) => {
        if(err){
            sendErrorResponse(res, 500, err);
        } else {
            sendSuccessResponse(res, 200, data);
        }
        return;
    });
};

// 데이터 추가
exports.addJsonData = (req, res, JSONfilePath) => {
    let body = '';
        
    // 데이터 수신
    req.on('data', chunk => body += chunk);
    
    req.on('end', () => {
        const data = JSON.parse(body); // 파싱    
    
        //기존 JSON 데이터 읽기
        fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
            if (err){
                sendErrorResponse(res, 500, err);
            }
    
            // 기존 데이터 파싱 후 새로운 데이터 추가
            const parsedData = JSON.parse(jsonData);
            parsedData.push(data);
    
            // 수정된 데이터 다시 저장
            fs.writeFile(JSONfilePath, JSON.stringify(parsedData, null, 2), 'utf8', (err) => {
                if(err){
                    sendErrorResponse(res, 500, err);
                }
                sendErrorResponse(res, 200);
            });
        });
    });
    return;
};

// 데이터 업데이트
exports.updateData = (req, res, JSONfilePath) => {
    let body = '';
    const dataMode = JSONfilePath.split('\\').at(-1);
        
    // 데이터 수신
    req.on('data', chunk => {
        body += chunk;
    });
    
    req.on('end', () => {
        // console.log(dataMode);
        // 받아온 데이터 가공
        let itemMode = null;
        let parsedData = null;
        switch(dataMode){
            case DATA_MODE[0]:
                const tmp = JSON.parse(body);
                itemMode = tmp.itemMode;
                parsedData = tmp.data;
                break;
            case DATA_MODE[1]:
                parsedData = JSON.parse(body);
                break;
            case DATA_MODE[2]:
                parsedData = JSON.parse(body);
                break;
        }
        // console.log(1);
        // console.log(parsedData);
        

        // 기존 데이터 읽기
        fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
            if (err) {
                sendErrorResponse(res, 500, err);
            }

            // 데이터 가공
            let updateData = {};
            switch(dataMode){
                case DATA_MODE[0]:
                    updateData = JSON.parse(jsonData);
                    updateData[itemMode] = parsedData;
                    break;
                case DATA_MODE[1]:
                    updateData = parsedData;
                    break;
                case DATA_MODE[2]:
                    updateData = JSON.parse(jsonData) || [];
                    const postIndex = updateData.findIndex((post) => post.id == parsedData.id);

                    if(postIndex === -1){
                        sendErrorResponse(res, 404, err);
                    }

                    // 기존 데이터 수정
                    updateData[postIndex] = {...updateData[postIndex], ...parsedData};
                    break;
            }
            // console.log(updateData);

            // 데이터 저장
            fs.writeFile(JSONfilePath, JSON.stringify(updateData, null, 2), 'utf8', (err) => {
                if (err) {
                    sendErrorResponse(res, 500, err);
                }

                sendErrorResponse(res, 200);
            });
        });   
    });
    return; 
}

// 데이터 삭제
exports.deleteData = (req, res, JSONfilePath) => {
    const urlParts = req.url.split('/');
    const delIndex = urlParts[urlParts.length -1];
    let itemMode = '';
    const dataMode = JSONfilePath.split('\\').at(-1);


    if(dataMode === DATA_MODE[0]){
        itemMode = urlParts[urlParts.length - 2];
    }

    fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
        if (err) {
            sendErrorResponse(res, 500, err);
        }

        // 기존 데이터 불러오기
        let item = JSON.parse(jsonData) || [];
        let filtereditems = [];

        switch(dataMode){
            case DATA_MODE[2]:
                filtereditems = item.filter((post) => post.id != Number(delIndex));
                console.log(filtereditems);
                
                if(item.length === filtereditems.length){
                    sendErrorResponse(res, 404, err);
                }
                break;
            case DATA_MODE[1]:
                filtereditems = item.filter((_, index) => index != delIndex);
                
    
                if(item.length === filtereditems.length){
                    sendErrorResponse(res, 404, err);
                }
                break;
            case DATA_MODE[0]:
                // console.log(item[itemMode]);
                const filtereditemsMode = item[itemMode].filter((_, index) => index != delIndex);
                
                if(item[itemMode].length === filtereditemsMode.length){
                    sendErrorResponse(res, 404, err);
                }

                item[itemMode] = filtereditemsMode;
                filtereditems = item;
                break;
        }

        // 수정 데이터 저장
        fs.writeFile(JSONfilePath, JSON.stringify(filtereditems, null, 2), 'utf8', (err) => {
            if (err) {
                sendErrorResponse(res, 500, err);
            }

            sendErrorResponse(res, 200, err);
        });
    });
    return;
}