const fs = require('fs');
const path = require('path');
const { sendErrorResponse, sendSuccessResponse } = require('./utils');

const DATA_MODE = ['optionData.json', 'historyData.json', 'postData.json'];

// 데이터 가져오기
exports.getJsonData = (req, res, JSONfilePath)  => {
    fs.readFile(JSONfilePath, 'utf8', (err, data) => {
        const parsedData = JSON.parse(data);
        if(err){
            return sendErrorResponse(res, 500, err);
        } else {
            const id = req.params.id ? req.params.id : null;
            if(!id){
                sendSuccessResponse(res, 200, parsedData);
                return;
            }
            
            const findData = parsedData.find(item => item.id == id);

            // console.log(findData);
            
            sendSuccessResponse(res, 200, findData);
        }
    });
};

// 데이터 추가
exports.addJsonData = (req, res, JSONfilePath) => {
    const newdata = req.body; 

    //기존 JSON 데이터 읽기
    fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
        if (err){
            return sendErrorResponse(res, 500, err);
        }

        // 기존 데이터 파싱 후 새로운 데이터 추가
        const parsedData = JSON.parse(jsonData);
        parsedData.push(newdata);

        // 수정된 데이터 다시 저장
        fs.writeFile(JSONfilePath, JSON.stringify(parsedData, null, 2), 'utf8', (err) => {
            if(err){
                return sendErrorResponse(res, 500, err);
            }
            sendSuccessResponse(res, 200);
        });
    });
};

// 데이터 업데이트
exports.updateData = (req, res, JSONfilePath) => {
    const dataMode = path.basename(JSONfilePath);

    let itemMode = '';
    let data = '';
    
    switch(dataMode){
        case DATA_MODE[0]: //옵션
            itemMode = req.body.itemMode;
            data = req.body.data;
            break;
        case DATA_MODE[1]:
            data = req.body;
            break;
        case DATA_MODE[2]:
            data = req.body;
            break;
    }
    

    // 기존 데이터 읽기
    fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
        if (err) {
            return sendErrorResponse(res, 500, err);
        }

        // 데이터 가공
        let parsedData = JSON.parse(jsonData);
        switch(dataMode){
            case DATA_MODE[0]:
                parsedData[itemMode] = data;
                break;
            case DATA_MODE[1]:
                parsedData = data;
                break;
            case DATA_MODE[2]:
                const postIndex = parsedData.findIndex((post) => post.id == data.id);

                if(postIndex === -1){
                    return sendErrorResponse(res, 404, err);
                }

                // 기존 데이터 수정
                parsedData[postIndex] = {...parsedData[postIndex], ...data};
                break;
        }
        // console.log(parsedData);

        // 데이터 저장
        fs.writeFile(JSONfilePath, JSON.stringify(parsedData, null, 2), 'utf8', (err) => {
            if (err) {
                return sendErrorResponse(res, 500, err);
            }

            sendSuccessResponse(res, 200);
        });
    });   
}

// 데이터 삭제
exports.deleteData = (req, res, JSONfilePath) => {
    const id = req.params.id;
    const dataMode = path.basename(JSONfilePath);
    const itemMode = req.query.itemMode ? req.query.itemMode : '';


    fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
        if (err) {
            return sendErrorResponse(res, 500, err);
        }

        let parsedData = JSON.parse(jsonData);

        switch(dataMode){
            case DATA_MODE[2]:
                parsedData = parsedData.filter((post) => post.id != id);
                break;
            case DATA_MODE[1]:
                parsedData = parsedData.filter((_, index) => index != id);
                break;
            case DATA_MODE[0]:
                parsedData[itemMode] = parsedData[itemMode].filter((_, index) => index != id);
                break;
        }

        // 수정 데이터 저장
        fs.writeFile(JSONfilePath, JSON.stringify(parsedData, null, 2), 'utf8', (err) => {
            if (err) {
                return sendErrorResponse(res, 500, err);
            }

            sendSuccessResponse(res, 200);
        });
    });
    return;
}