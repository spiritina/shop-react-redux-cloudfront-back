const AWS = require('aws-sdk')

module.exports.catalogBatchProcess = async (event) => {
   event.Records.forEach((product)=> {
        console.log(product)
        const sns = new AWS.SNS();
        const snsParams = {
            Message: "Product Created",
            TopicArn: process.env.SNS_TOPIC
        }
        sns.publish(snsParams, (err, data) => {
            if(err){
                console.log("Error: ", error)
            }else {
                console.log("Product created:", data.MessageId)
            }
        })
   })
}