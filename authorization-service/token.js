module.exports.token =(event, ct, cb) => {
    const response = {
        "statusCode": 200,
        "body": "Wellcome!"
    };
    cb(null, response);
}