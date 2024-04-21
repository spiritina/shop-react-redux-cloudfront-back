const AWS  = require("aws-sdk");
const BUCKET = "o-novak-shop-react-redux-cloudfront-import";
const REGION = "eu-west-1";
const defaultHeaders = {
    "Content-Type": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, GET",
    'Access-Control-Allow-Credentials' : true,
}
module.exports.importProductsFile = async (event) => {
    const s3 = new AWS.S3({ region: REGION, apiVersion: '2006-03-01' })
    let statusCode = 200;
    let body = {};
    try {
        const { name } = event.queryStringParameters;
        const params = {
            Bucket: BUCKET,
            Key: `uploaded/${name}`,
            ContentType: "text/csv",
            Expires: 60,
        };
        const url = s3.getSignedUrl("putObject", params);
        body = url;
    } catch (error) {
        console.log(error)
        statusCode = 500;
        body = error;
    }
    return {
        statusCode,
        headers: defaultHeaders, 
        body: JSON.stringify(body)
    }
}