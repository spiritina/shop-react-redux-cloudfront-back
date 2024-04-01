'use strict';

const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const put = async (item) => {
  const FinalItem = {
    id: {
       S: AWS.util.uuid.v4()
    },
    title: { S: item.title },
    description: {S: item.description || ""},
    price: { N: item.price || 0}
  }  
  return dynamo.putItem({
    TableName: process.env.TABLE_NAME,
    Item: FinalItem
  }).promise()
}  
module.exports.createProduct = async (event) => {
    const item = JSON.parse(event?.body);
    if (!item.title){ return {statusCode: 400, body: JSON.stringify({error: "Title is missing"})}}
    const putResults = await put(item);
    return putResults
  }