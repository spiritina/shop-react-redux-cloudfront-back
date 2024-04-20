import { Client } from 'pg';

const AWS = require('aws-sdk');
const { createProduct } = require('./createProduct');

module.exports.catalogBatchProcess = async (event) => {
    const client = new Client({
        connectionString: "",
      });
   await client.connect();
   event.Records.forEach((product)=> {
        console.log(product);
        createProduct({body: product});
        const sns = new AWS.SNS();
        const snsParams = {
            Message: "Product Created",
            TopicArn: process.env.SNS_TOPIC
        }
        sns.publish(snsParams, (err, data) => {
            if(err){
                console.log("Error: ", err)
            }else {
                console.log("Product created:", data.MessageId)
            }
        })
   })
}