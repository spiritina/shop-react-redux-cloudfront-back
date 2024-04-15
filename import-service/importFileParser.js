const AWS  = require("aws-sdk");
// const { error, timeStamp } = require("console");
const csvParser = require("csv-parser");
const BUCKET = "o-novak-shop-react-redux-cloudfront-import";
const REGION = "eu-west-1";
module.exports.importFileParser = async (event) => {
    // const parser = csvParser()
    const s3 = new AWS.S3({ region: REGION, apiVersion: '2006-03-01' })

    const cloudWatchLogs = new AWS.CloudWatchLogs();
    // const logToCloudWatch = (data, fileName) => {
    //     const params = {
    //         logGroupName: "/aws/lambda/import-service-dev-importFileParser",
    //         logStreamName: fileName,
    //         logEvents: [{
    //             message: data,
    //             timeStamp: new Date().getTime()
    //         }]
    //     }
    //     cloudWatchLogs.putLogEvents(params, function(err, data){
    //         if(err){
    //             console.error("error logging to CloudWatch", err)
    //         } else{
    //             console.log("Successfully logged: ", data)
    //         }
    //     })
    // }
    for (const record of event.Records) {
        const params = {
            Bucket: BUCKET,
            Key: record.object.key,
            ContentType: "text/csv"
        }
        const sqs = new AWS.SQS();
        const s3Stream = s3.getObject(params).createReadStream();
        s3Stream
            .pipe(csvParser())
            .on("data", (data)=> {
                sqs.sendMessage({
                    QueueUrl: process.env.SQS_URL,
                    MessageBody: data
                }, () => {
                    console.log("Send message", message)
                })
                // logToCloudWatch(JSON.stringify(data), record.object.fileName)
            })
            .on("error", (error) => { console.log("Error parcing csv: ", error)})
            .on("end", () => {
                console.log("CSV parced")
            })
    }
}