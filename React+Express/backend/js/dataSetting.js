const fs = require('fs');
const path = require('path');
const { sendErrorResponse, sendSuccessResponse, sendResultResponse } = require('./utils');

const DATA_MODE = ['optionData.json', 'historyData.json', 'postData.json', 'userData.json'];

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
    const dataMode = path.basename(JSONfilePath);
    const getData = req.body;
    let newdata = null;
    let itemMode = null;

    switch(dataMode){
        case DATA_MODE[0]: // 옵션
            newdata = getData.data;
            itemMode = getData.itemMode;
            break;
        case DATA_MODE[1]: // 히스토리
            newdata = getData;
            break;
        case DATA_MODE[2]: // 포스트
            newdata = getData;
            break;
        case DATA_MODE[3]: // 유저
            newdata = getData;
            break;
    }

    //기존 JSON 데이터 읽기
    fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
        if (err){
            return sendErrorResponse(res, 500, err);
        }

        // 기존 데이터 파싱 후 새로운 데이터 추가
        const parsedData = JSON.parse(jsonData);
        
        switch(dataMode){
            case DATA_MODE[0]: // 옵션
                parsedData[itemMode].push(newdata);
                break;
            case DATA_MODE[1]: // 히스토리
                parsedData.unshift(newdata);
                break;
            case DATA_MODE[2]: // 포스트
                parsedData.unshift(newdata);
                break;
            case DATA_MODE[3]: // 유저
                parsedData.push(newdata);
                break;
        }
        

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
    
    // console.log(req.body);

    // 기존 데이터 읽기
    fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
        if (err) {
            return sendErrorResponse(res, 500, err);
        }

        // 데이터 가공
        let parsedData = JSON.parse(jsonData);
        let targetId = null;
        switch(dataMode){
            case DATA_MODE[0]:

                targetId = parsedData[itemMode].findIndex((post) => post.id == data.id);

                if(targetId === -1){
                    return sendErrorResponse(res, 404, err);
                }

                // 기존 데이터 수정
                parsedData[itemMode][targetId] = {...parsedData[itemMode][targetId], ...data};
                break;
                break;
            case DATA_MODE[1]:
                targetId = parsedData.findIndex((post) => post.id == data.id);

                if(targetId === null){
                    return sendErrorResponse(res, 404, err);
                }

                // 기존 데이터 수정
                parsedData[targetId] = {...parsedData[targetId], ...data};

                break;
            case DATA_MODE[2]:
                targetId = parsedData.findIndex((post) => post.id == data.id);

                if(targetId === -1){
                    return sendErrorResponse(res, 404, err);
                }

                // 기존 데이터 수정
                parsedData[targetId] = {...parsedData[targetId], ...data};
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
    const itemMode = req.params.itemMode ? req.params.itemMode : '';
    console.log(id);
    console.log(itemMode);
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
                parsedData = parsedData.filter((item) => item.id != id);
                break;
            case DATA_MODE[0]:
                parsedData[itemMode] = parsedData[itemMode].filter((item) => item.id != id);
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


// 아이디 조회
exports.compareData = (req, res, JSONfilePath) => {
    const getData = req.body;
    
    fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
        
        if (err) {
            return sendErrorResponse(res, 500, err);
        }

        try {
            let parsedData = JSON.parse(jsonData);

            let existingData = null;

            // 검색 조건 분기 처리
            switch(getData.searchType){
                case "userName":
                    existingData = parsedData.find(item => item.userName === getData.compareData);
                    console.log(getData);
                    break;
                case "userId":
                    existingData = parsedData.find(item => item.userId === getData.compareData);
                    break;
                case "login":
                    existingData = parsedData.find(item => item.userId === getData.compareData.userId);

                    if(existingData){
                        if(existingData.password === getData.compareData.password){
                            return sendResultResponse(res, 200, true, {userid: existingData.userId});
                        }
                        return sendResultResponse(res, 200, false, {message: "Wrong Password"});
                    }
                    else{
                        return sendResultResponse(res, 200, false, {message: "userID Not Found"});
                    }
            }

            // 결과 처리
            if (existingData) {
                return sendResultResponse(res, 200, true, {message: '중복된 것이 있습니다.'}); // 검색 성공 시 결과 반환
            } else {
                return sendResultResponse(res, 200, false, { message: "사용 가능합니다." }); // 검색 실패 시 메시지 반환
            }
        }
        catch(err) {
            return sendErrorResponse(res, 500, err);
        }
        
    })
}