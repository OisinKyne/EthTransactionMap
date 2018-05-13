// File for connecting with the locally runninng geth client to query for transactions. 



exports.findTransaction = async function(transaction){

    // 
    var Web3 = require('web3');
    console.log('Geth Find Transaction Called.')
    console.log('Web3 Object:');
    console.log(Web3)

    var web3 = new Web3(Web3.givenProvider || 'http://localhost:8546');
    console.log('\n\nweb3 obj.eth:');
    console.log(web3);  

    var transaction = web3.eth.getTransaction(transaction, function(error, foundTransaction){
        console.log('\n\ngeth Object Returned:');
        console.log(foundTransaction)
    })

    return transaction
}
