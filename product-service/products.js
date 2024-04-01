'use strict';
const AWS = require('aws-sdk');
const { getCountById } = require('./product');
const dynamo = new AWS.DynamoDB.DocumentClient();
const scan = async () => {
  const scanResults = await dynamo.scan({
    TableName: process.env.TABLE_NAME
  }).promise();
  const result = await Promise.all(scanResults.Items.map(async el => ({...el, count: await getCountById(el.id)})));
  return result;
}
module.exports.getProductsList = async() => {
  try{
    const scanResults = await scan();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, GET",
      },
      body: JSON.stringify(
        scanResults
      )
    };
  } catch (_) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
  }
};
