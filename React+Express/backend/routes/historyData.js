// const fs = require('fs');
// const path = require('path');
// const { getJsonData, addJsonData, updateData, deleteData } = require('../js/dataSetting.js');

// const JSON_FILE_PATH = path.join(__dirname, "../data", 'historyData.json');

// const historyDataHandler = (req, res) => {
//     if (req.method == 'GET') {
//         getJsonData(req, res, JSON_FILE_PATH);
//     } 
//     else if (req.method == 'POST') {
//         addJsonData(req, res, JSON_FILE_PATH);
//     } 
//     else if (req.method == 'PUT') {
//         updateData(req, res, JSON_FILE_PATH);
//     } 
//     else if (req.method == 'DELETE') {
//         deleteData(req, res, JSON_FILE_PATH);
//     }
// };

// module.exports = historyDataHandler;

const express = require('express');
const path = require('path');
const { getJsonData, addJsonData, updateData, deleteData } = require('../js/dataSetting');
const router = express.Router();

const JSON_FILE_PATH = path.join(__dirname, "../../data", 'historyData.json');

// 라우트 : /data/historyData

router.get('/', (req, res) => {
    getJsonData(req, res, JSON_FILE_PATH);
});

router.post('/', (req, res) => {
    addJsonData(req, res, JSON_FILE_PATH);
});

router.put('/', (req, res) => {
    updateData(req, res, JSON_FILE_PATH);
});

router.delete('/', (req, res) => {
    deleteData(req, res, JSON_FILE_PATH);
});

module.exports = router;