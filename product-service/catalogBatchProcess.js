const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

module.exports.catalogBatchProcess = async (event) => {
    try {    
        for (const record of event.Records) {
          const product = JSON.parse(record.body);
          console.log('Product:', product);
    
          if (
            !product ||
            !product.title ||
            !product.description ||
            typeof parseFloat(product.price) !== 'number' ||
            typeof parseInt(product.count) !== 'number'
          ) {
            throw new Error("Invalid product", JSON.stringify(product))
          }
    
          const { title, description, price } = product;
          const count = product.count || 0;
          const id = AWS.util.uuid.v4();
          const FinalItem = {
            id: {
               S: id
            },
            title: { S: title },
            description: {S: description || ""},
            price: { N: String(price) || "0" }
          }  
    
          // Upsert Product Data
          const putStore = async (item) => {
            await dynamo.putItem({
                TableName: process.env.TABLE_STORE,
                Item: { 
                    product_id: { S: item.id },
                    count: { N: String(count) || "0" }
                }
              }).promise();

            await putStore({ count, id});
            await dynamo.putItem({
                TableName: process.env.TABLE_NAME,
                Item: FinalItem
            }).promise()
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
        }  
        }  
      } catch (err) {
        console.log(err)
      }
}