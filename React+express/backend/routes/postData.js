const express = require('express');
const path = require('path');
const { getJsonData, addJsonData, updateData, deleteData } = require('../js/dataSetting');
const router = express.Router();

const JSON_FILE_PATH = path.join(__dirname, "../../data", 'postData.json');

// 라우트 : /data/postData

router.get('/:id', (req, res) => {
    getJsonData(req, res, JSON_FILE_PATH);
});

router.get('/', (req, res) => {
    getJsonData(req, res, JSON_FILE_PATH);
});

router.post('/', (req, res) => {
    addJsonData(req, res, JSON_FILE_PATH);
});

router.put('/', (req, res) => {
    updateData(req, res, JSON_FILE_PATH);
});

router.delete('/delete/:id', (req, res) => {
    deleteData(req, res, JSON_FILE_PATH);
});

module.exports = router;