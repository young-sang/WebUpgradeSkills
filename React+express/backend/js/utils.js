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

// 성공 여부 보내기

exports.sendResultResponse = (res, statusCode, result, data = null) => {
    res.status(statusCode).json({
        success: result,
        data: data,
    });
};