// File for connecting with the locally runninng geth client to query for transactions. 



exports.findTransaction = async function(transaction){

    var Web3 = require('web3');
    var web3 = new Web3('https://mainnet.infura.io/B2zjir7rPDR7JM8r6SQN');

    return web3.eth.getTransaction(transaction, function(error, foundTransaction){
        return foundTransaction
    });

}
