'use strict';

const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient();
const getCountById = async (id) => {
  const price =  await dynamo.query({
    TableName: process.env.TABLE_STORE,
    KeyConditionExpression: "#id = :product_id",
    // FilterExpression: "#id = :product_id",
    ExpressionAttributeNames: {
      "#id": "product_id",
  },
    ExpressionAttributeValues: {":product_id": id},
  }).promise();
  return price?.Items[0]?.count || 0
};
module.exports.getCountById = getCountById;
const query = async (id) => {
  const scanResults = await dynamo.query({
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "#id = :id",
    // FilterExpression: "#id = :id",
    ExpressionAttributeNames: {
      "#id": "id",
  },
    ExpressionAttributeValues: {":id": id},
  }).promise();
  
  const item = scanResults?.Items[0];
  const finalItem = item ? {...item, count: getCountById(id) }: undefined
  return finalItem;
}  
module.exports.getProductsById = async (event) => {
    try {
      const productId = event?.pathParameters?.productId;
      const product = await query(productId);
      if (product){
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, GET",
          },
          body: JSON.stringify(product)
        };
      } else {
        return {
          statusCode: 404,
          headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, GET",
          },
          body: JSON.stringify({error: `Product with ID ${productId} is not found`})
      }}
  } catch (_) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
  }
  }