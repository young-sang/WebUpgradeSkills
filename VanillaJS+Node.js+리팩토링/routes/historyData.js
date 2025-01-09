const fs = require('fs');
const path = require('path');
const { getJsonData, addJsonData, updateData, deleteData } = require('../js/dataSetting.js');

const JSON_FILE_PATH = path.join(__dirname, "../data", 'historyData.json');

const historyDataHandler = (req, res) => {
    if (req.method == 'GET') {
        getJsonData(req, res, JSON_FILE_PATH);
    } 
    else if (req.method == 'POST') {
        addJsonData(req, res, JSON_FILE_PATH);
    } 
    else if (req.method == 'PUT') {
        updateData(req, res, JSON_FILE_PATH);
    } 
    else if (req.method == 'DELETE') {
        deleteData(req, res, JSON_FILE_PATH);
    }
};

module.exports = historyDataHandler;