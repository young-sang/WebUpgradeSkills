const fs = require('fs');
const path = require('path');
const { getJsonData, addJsonData, updateData, deleteData } = require('../js/dataSetting.js');

const JSON_FILE_PATH = path.join(__dirname, "../data", 'options.json');

const optionDataHandler = (req, res) => {
    if (req.method == 'GET') {
        getJsonData(req, res, JSON_FILE_PATH);        
    } 
    else if (req.method == 'PUT') {
        updateData(req, res, JSON_FILE_PATH);
    } 
    else if (req.method == 'DELETE') {
        deleteData(req, res, JSON_FILE_PATH);
    }
};

module.exports = optionDataHandler;