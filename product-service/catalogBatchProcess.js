const AWS = require('aws-sdk')

module.exports.catalogBatchProcess = async (event) => {
   event.Records.forEach((product)=> {
        console.log(product)
   })
}