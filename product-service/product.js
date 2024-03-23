'use strict';

const products = require("./mockData").products;
module.exports.getProductsById = async (event) => {
    const productId = event?.pathParameters?.productId;
    const product = products.find(el => el.id === productId)
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
        body: {error: `Product with ID ${productId} is not found`}
    }}
  }