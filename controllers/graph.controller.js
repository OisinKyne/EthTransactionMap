
// Accessing the Service that we just created

var TransactionService = require('../services/transaction.service')
var GethService = require('../services/geth.service')

// Saving the context of this module inside the _the variable

//To Do: Figure out how functions work in async javascript better so I can break this long method down. 

_this = this

exports.getTransactions = async function (req, res, next) {

    if (!req.body.hashes) {
        return res.status(400).json({ status: 400., message: "Please supply a list of transaction hashes." })
    }

    var hashes = req.body.hashes;

    // Query the DB for transactions there first and query geth for the missing ones.
    databaseTransactions = [];
    transactionsForWeb3 = [];
    for (i = 0; i < hashes.length; i++) {
        console.log('Processing: ' + hashes[i]);
        databaseTransaction = await TransactionService.getTransactionByHash(hashes[i]);

        if (databaseTransaction === null) {
            //Save this hash as the list to retrieve from Geth. 
            transactionsForWeb3.push(hashes[i]);
        }
        else {
            databaseTransactions.push(databaseTransaction);
        }
    }
    // Now retrieve missing ones from geth.

    gethTransactions = [];
    for (i = 0; i < transactionsForWeb3.length; i++) {
        gethTransactions.push(await GethService.findTransaction(transactionsForWeb3[i]));
    }
    console.log('Geth Transactions Returned: ')
    console.log(gethTransactions)
    transactionsToSave = [];
    for (i = 0; i < gethTransactions.length; i++) {
        try {
            var transaction = {
                hash: gethTransactions[i].hash,
                toAddress: gethTransactions[i].from,
                fromAddress: gethTransactions[i].to,
                eth: Number(gethTransactions[i].value),
                gasUsed: Number(gethTransactions[i].gasPrice),
                blockNumber: Number(gethTransactions[i].blockNumber),
                info: gethTransactions[i].input
            }
            transactionsToSave.push(transaction);
            TransactionService.createTransaction(transaction);

        } catch (e) {
            return res.status(400).json({ status: 400, message: "Transaction retrieval from the Ethereum network failed. e: " + e.message })
        }
    }

    databaseTransactions.push(transactionsToSave)
    output = databaseTransactions;
    console.log('Finally returning ' + output.length + ' transaction objects. ');

    try {
        
        return res.status(200).json(output)
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message })
    }

}

