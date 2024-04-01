'use strict';
const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient();
const scan = async () => {
  const scanResults = await dynamo.scan({
    TableName: process.env.TABLE_NAME
  }).promise()
  return scanResults;
}
module.exports.getProductsList = async() => {
  const scanResults = await scan();
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, GET",
    },
    body: JSON.stringify(
      scanResults["Items"]
    )
  };
};
