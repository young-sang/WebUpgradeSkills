const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3000;

//
// app.use(bodyParser.json());
app.use(express.json());


// 라우트 파일 가져오기
const postDataRouter = require('./routes/postData.js');
const historyDataRouter = require('./routes/historyData.js');
const optionDataRouter = require('./routes/optionData.js');


// 미들웨어로 라우트 등록
app.use('/data/postData', postDataRouter);
app.use('/data/historyData', historyDataRouter);
app.use('/data/optionData', optionDataRouter);

// 정적 파일 경로 설정
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));