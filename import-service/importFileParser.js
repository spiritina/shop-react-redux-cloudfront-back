const AWS  = require("aws-sdk");
const csvParser = require("csv-parser");
const { Readable } = require('stream');

const REGION = "eu-west-1";
module.exports.importFileParser = async (event) => {
    const s3 = new AWS.S3({ region: REGION, apiVersion: '2006-03-01' })

    const cloudWatchLogs = new AWS.CloudWatchLogs();
    const logToCloudWatch = async (data) => {
        const params = {
            logGroupName: "/aws/lambda/import-service-dev-importFileParser",
            logStreamName: "2024/04/21/[$LATEST]545e6e4d286d4d579b3eb6f1d5fb4e75",
            logEvents: [{
                message: JSON.stringify(data),
                timestamp: new Date().getTime()
            }]
        }
        await cloudWatchLogs.putLogEvents(params, function(err, data){
            if(err){
                console.error("error logging to CloudWatch", err)
            } else{
                console.log("Successfully logged: ", data)
            }
        }).promise()
    }
    await logToCloudWatch(event);
    for (const record of event.Records) {
        logToCloudWatch(record)
        const params = {
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key,
            // ContentType: "text/csv"
        }
        const sqs = new AWS.SQS();
        const s3Object = await s3.getObject(params).promise();
        const s3Stream = Readable.from(s3Object.Body);
        // s3Stream._read = () => {};
        // s3Stream.push(s3Object.Body);
        s3Stream.push(null);
        s3Stream
            .pipe(csvParser())
            .on("data", (data)=> {
                console.log(data)
                const params = {
                    QueueUrl: "https://sqs.eu-west-1.amazonaws.com/905418409104/catalogItemsQueue",
                    MessageBody: JSON.stringify(data),
                  };
                sqs.sendMessage(params).promise().then(async (resp) =>{
                    console.log(resp);
                    await logToCloudWatch(data) 
                })            
            })
            .on("error", (error) => { console.log("Error parcing csv: ", error)})
            .on("end", (event) => {
                console.log("CSV parced", event)
            })
    }
}