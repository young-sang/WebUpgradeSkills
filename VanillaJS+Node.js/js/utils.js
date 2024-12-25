const fs = require('fs');
const path = require('path');

// json 데이터 가져오기
exports.getJsonData = (jsonPath)  => {
    return new Promise((resolve, reject) => {
        const JSONfilePath = path.join(__dirname, "../data", jsonPath);
        // console.log(JSONfilePath);

        fs.readFile(JSONfilePath, 'utf8', (err, data) => {
            if(err){
                reject({error: 'Failed to read the file'});
            } else {
                resolve(data);
            }
        });
    });
};

// 데이터 추가
exports.addJsonData = (body, jsonPath) => {
    
    return new Promise((resolve, reject) => {
        const data = JSON.parse(body); // 파싱
        const JSONfilePath = path.join(__dirname, "../data", jsonPath);
        
    
        //기존 JSON 데이터 읽기
        fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
            if (err){
                reject({message: 'Error reading Data', err});
                return;
            }
    
            // 기존 데이터 파싱 후 새로운 데이터 추가
            const parsedData = JSON.parse(jsonData);
            parsedData.push(data);
            console.log(parsedData);
    
            // 수정된 데이터 다시 저장
            fs.writeFile(JSONfilePath, JSON.stringify(parsedData, null, 2), 'utf8', (err) => {
                if(err){
                    reject({message: 'Error saving Data', err});
                    return;
                }
                resolve({message: 'Data added successfull'});
            });
        });
    });
};