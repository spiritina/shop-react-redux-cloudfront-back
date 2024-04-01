'use strict';

const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const putStore = async (item) => {
    await dynamo.putItem({
        TableName: process.env.TABLE_STORE,
        Item: { 
            product_id: { S: item.id },
            count: { N: String(item.count) || "0" }
        }
      }).promise();
}

const isValid = (item) => {
    if (!item.title || typeof item.title !== "string") return {error: "Title is not valid"}
    if (!item.price || typeof item.price !== "number") return {error: "Price is not valid"}
    if (!item.count || typeof item.count !== "number") return {error: "Price is not valid"}
    return true
}

const put = async (item) => {
  const id = AWS.util.uuid.v4();
  const FinalItem = {
    id: {
       S: id
    },
    title: { S: item.title },
    description: {S: item.description || ""},
    price: { N: String(item.price) || "0" }
  }  
  await putStore({...item, id});
  return dynamo.putItem({
    TableName: process.env.TABLE_NAME,
    Item: FinalItem
  }).promise()
}  
module.exports.createProduct = async (event) => {
    if (!event.body){ return {statusCode: 400, body: {error: "Item is not valid"}}};
    const item = JSON.parse(event?.body);
    const error = isValid(item).error;
    if (error){ return {statusCode: 400, body: JSON.stringify({error})}}
    const putResults = await put(item);
    return putResults
  }