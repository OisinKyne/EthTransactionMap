// File for connecting with the locally runninng geth client to query for transactions. 



exports.findTransaction = async function(transaction){

    // 
    var Web3 = require('web3');
    console.log('Geth Find Transaction Called.')

    // console.log('Web3 Object:');
    // console.log(Web3)

    var web3 = new Web3('https://mainnet.infura.io/B2zjir7rPDR7JM8r6SQN');

    console.log('The transaction were passing in: ');
    console.log(transaction);

    return web3.eth.getTransaction(transaction, function(error, foundTransaction){
        console.log('\n\ngeth Object Returned:');
        console.log(foundTransaction);
        console.log('Error:')
        console.log(error);
        return foundTransaction
    });

}
