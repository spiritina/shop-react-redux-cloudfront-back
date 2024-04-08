const AWS  = require("aws-sdk");
const { error } = require("console");
const BUCKET = "o-novak-shop-react-redux-cloudfront-import";
const REGION = "eu-west-1";
module.exports.importFileParser = async (event) => {
    const s3 = new AWS.S3({ region: REGION, apiVersion: '2006-03-01' })
    for (const record of event.Records) {
        const params = {
            Bucket: BUCKET,
            Key: record.object.key,
            ContentType: "text/csv"
        }
        const s3Stream = s3.getObject(params).createReadStream();
        s3Stream
            .on("data", (data) => {

            })
            .on("error", (error) => { console.log(error)})
            .on("end", () => {

            })
    }
}