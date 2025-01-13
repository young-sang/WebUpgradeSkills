const fs = require('fs');
const path = require('path');
const { sendErrorResponse, sendSuccessResponse } = require('./utils');

const DATA_MODE = ['optionData.json', 'historyData.json', 'postData.json'];

// 데이터 가져오기
exports.getJsonData = (req, res, JSONfilePath)  => {
    fs.readFile(JSONfilePath, 'utf8', (err, data) => {
        if(err){
            return sendErrorResponse(res, 500, err);
        } else {
            sendSuccessResponse(res, 200, JSON.parse(data));
        }
    });
};

// 데이터 추가
exports.addJsonData = (req, res, JSONfilePath) => {
    const newdata = req.body; 
    console.log(req.data);

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
    const dataMode = JSONfilePath.split('\\').at(-1);
    const { itemMode, data} = req.body;
    

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
                const postIndex = updateData.findIndex((post) => post.id == data.id);

                if(postIndex === -1){
                    return sendErrorResponse(res, 404, err);
                }

                // 기존 데이터 수정
                parsedData[postIndex] = {...parsedData[postIndex], ...data};
                break;
        }
        // console.log(updateData);

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
    // const urlParts = req.url.split('/');
    // const delIndex = urlParts[urlParts.length -1];
    // let itemMode = '';
    // const dataMode = JSONfilePath.split('\\').at(-1);
    const delIndex = req.query.id;
    const dataMode = path.basename(JSONfilePath);
    const itemMode = req.query.itemMode;


    fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
        if (err) {
            return sendErrorResponse(res, 500, err);
        }

        let parsedData = JSON.parse(jsonData);

        switch(dataMode){
            case DATA_MODE[2]:
                parsedData = item.filter((post) => post.id != delIndex);
                break;
            case DATA_MODE[1]:
                parsedData = item.filter((_, index) => index != delIndex);
                break;
            case DATA_MODE[0]:
                parsedData[itemMode] = parsedData[itemMode].filter((_, index) => index != delIndex);
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