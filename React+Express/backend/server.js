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

// // 정적 파일 경로 설정
// app.use(express.static(path.join(__dirname, '../public')));



// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// React의 build 폴더를 정적 파일로 서빙
app.use(express.static(path.join(__dirname, '../frontend/build')));

// 모든 요청에 대해 React의 index.html 반환
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));