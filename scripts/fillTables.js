
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require('uuid');
const products = require("../product-service/mockData").products;

const fillTables = async () => {
    const client = new DynamoDB({ region: 'eu-west-1' });
    const fillStore = (productId) => {
        const params = {
          TableName: "HappyShopStore",
          Item: {
            product_id: { S: productId },
            count: { N: String(Math.floor((Math.random() * 100) + 1)) }
          }
        };
    
        client.putItem(params, (err, data) => {
          if (err) {
             console.error(err);
          }
        });
    };
    const fillProduct = (product) => {
        const id = uuidv4();
    
        const params = {
          TableName: "HappyShopProduct",
          Item: {
            id: { S: id },
            title: { S: product.title },
            description: { S: product.description },
            // send as string to avoid issue with serialization - https://stackoverflow.com/questions/71488712/number-value-cannot-be-converted-to-string-when-updating-item
            price: { N: String(product.price) },
          },
        };
    
        client.putItem(params, (err) => {
          if (err) {
             console.error(err);
          } else {
              fillStore(id);
          }
        });
      };
    
      products.forEach((product) => fillProduct(product));

};
fillTables();