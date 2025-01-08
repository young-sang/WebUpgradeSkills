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

exports.updateData = (req, res, body, jsonPath) => {
        const JSONfilePath = path.join(__dirname, '../data', jsonPath);
        // console.log(jsonPath);

        // 받아온 데이터 가공
        let itemMode = '';
        let parsedData = '';
        switch(jsonPath){
            case 'options.json':
                const tmp = JSON.parse(body);
                itemMode = tmp.itemMode;
                parsedData = tmp.data;
                break;
            case 'history.json':
                parsedData = JSON.parse(body);
                break;
            case 'postData.json':
                parsedData = JSON.parse(body);
                break;
        }
        // console.log(parsedData);
        

        // 기존 데이터 읽기
        fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error reading data', error: err.message }));
                return;
            }
            // console.log(1);

            // 데이터 가공
            let updateData = {};
            switch(jsonPath){
                case 'options.json':
                    updateData = JSON.parse(jsonData);
                    updateData[itemMode] = parsedData;
                    break;
                case 'history.json':
                    updateData = parsedData;
                    break;
                case 'postData.json':
                    updateData = JSON.parse(jsonData) || [];
                    const postIndex = updateData.findIndex((post) => post.id == parsedData.id);

                    if(postIndex === -1){
                        res.writeHead(404, {"Content-Type": 'application/json'});
                        res.end(JSON.stringify({message: "Post not found"}));
                        return;
                    }

                    // 기존 데이터 수정
                    updateData[postIndex] = {...updateData[postIndex], ...parsedData};
                    break;
            }
            // console.log(updateData);

            // 데이터 저장
            fs.writeFile(JSONfilePath, JSON.stringify(updateData, null, 2), 'utf8', (err) => {
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

exports.deleteData = (req, res, jsonPath) => {
    
    const urlParts = req.url.split('/');
    const delIndex = urlParts[urlParts.length -1];
    let itemMode = '';

    if(jsonPath === 'options.json'){
        itemMode = urlParts[urlParts.length - 2];
    }
    
    const JSONfilePath = path.join(__dirname, "../data", jsonPath);


    fs.readFile(JSONfilePath, 'utf8', (err, jsonData) => {
        if (err) {
            res.writeHead(500, {'content-type': 'application/json'});
            res.end(JSON.stringify({message: 'Error reading data', err}));
            return;
        }

        // 기존 데이터 불러오기
        let item = JSON.parse(jsonData) || [];
        let filtereditems = [];

        switch(jsonPath){
            case 'postData.json':
                filtereditems = item.filter((post) => post.id != Number(delIndex));
                console.log(filtereditems);
                
                if(item.length === filtereditems.length){
                    res.writeHead(404, {'content-type': 'application/json'});
                    res.end(JSON.stringify({message: 'Item not found', err}));
                    return;
                }
                break;
            case 'history.json':
                filtereditems = item.filter((_, index) => index != delIndex);
                
    
                if(item.length === filtereditems.length){
                    res.writeHead(404, {'content-type': 'application/json'});
                    res.end(JSON.stringify({message: 'Item not found', err}));
                    return;
                }
                break;
            case 'options.json':                
                const filtereditemsMode = item[itemMode].filter((_, index) => index != delIndex);
                
                if(item[itemMode].length === filtereditemsMode.length){
                    res.writeHead(404, {'content-type': 'application/json'});
                    res.end(JSON.stringify({message: 'Item not found', err}));
                    return;
                }

                item[itemMode] = filtereditemsMode;
                filtereditems = item;
                break;
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
}