'use strict';

const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient();
const query = async (id) => {
  const scanResults = await dynamo.scan({
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "#id = :id",
    FilterExpression: "#id = :id",
    ExpressionAttributeNames: {
      "#id": "id",
  },
    ExpressionAttributeValues: {":id": id},
  }).promise()
  return scanResults;
}  
module.exports.getProductsById = async (event) => {
    const productId = event?.pathParameters?.productId;
    const productResp = await query(productId);
    const productItems = productResp["Items"];
    const product = productItems[0];
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
  }