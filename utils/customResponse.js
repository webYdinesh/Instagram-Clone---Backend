exports.success = (statusCode, message, result) => {
    return {
        statusCode,
        status: "ok",
        message,
        result,
    };
};
exports.error = (statusCode, message) => {
    return {
        statusCode,
        status: "error",
        message,
    };
};
