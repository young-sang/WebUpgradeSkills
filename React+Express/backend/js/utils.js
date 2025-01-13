// // res 에러 보내기
// exports.sendErrorResponse = (res, statusCode, error = null) => {
//     res.writeHead(statusCode, {'content-type': 'application/json'});
//     res.end(error);
//     return;
// }

// // res 깂 보내기
// exports.sendSuccessResponse = (res, statusCode, data = null) => {
//     res.writeHead(statusCode, {'content-type': 'application/json'});
//     if(data != null){
//         res.end(data);
//     }else{
//         res.end();
//     }
// }

// res 에러 보내기
exports.sendErrorResponse = (res, statusCode, error = null) => {
    res.status(statusCode).json({
        success: false,
        error: error || 'An error occurred'
    });
};

// res 깂 보내기
exports.sendSuccessResponse = (res, statusCode, data = null) => {
    res.status(statusCode).json({
        success: true,
        data: data || null
    });
};