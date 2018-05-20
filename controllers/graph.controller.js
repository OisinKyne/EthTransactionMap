
// Accessing the Service that we just created

var TransactionService = require('../services/transaction.service')
var GethService = require('../services/geth.service')

// Saving the context of this module inside the _the variable

//To Do: Figure out how functions work in async javascript better so I can break this long method down. 

_this = this

// Function to retrieve all transactions we have in the DB already.

async function getTransactionsFromDB(hashes) {
    
    // Query the DB for transactions there first and query geth for the missing ones.
    transactions = {
        fromDatabase: new Array,
        toGetFromWeb3: new Array
    }

    for (i = 0; i < hashes.length; i++) {
        console.log('Processing: ' + hashes[i]);
        databaseTransaction = await TransactionService.getTransactionByHash(hashes[i]);

        if (databaseTransaction === null) {
            //Save this hash as the list to retrieve from Geth. 
            transactions.toGetFromWeb3.push(hashes[i]);
        }
        else {
            transactions.fromDatabase.push(databaseTransaction);
        }
    }
    return transactions;
}



exports.getTransactions = async function (req, res, next) {

    // Test we're given a JSON body with an array named 'hashes'
    if (!req.body.hashes) {
        return res.status(400).json({ status: 400., message: "Please supply a list of transaction hashes." })
    } else if (!Array.isArray(req.body.hashes)) {
        return res.status(400).json({ status: 400., message: "Please supply a list of transaction hashes in JSON format." })
    }

    // Check if we have any of these hashes in our DB. 
    var transactions = await getTransactionsFromDB(req.body.hashes);
    
    // Now retrieve missing ones from geth.
    transactions.fromWeb3 = [];
    for (i = 0; i < transactions.toGetFromWeb3.length; i++) {
        transactions.fromWeb3.push(await GethService.findTransaction(transactions.toGetFromWeb3[i]));
    }

    transactionObjectsToSave = [];
    for (i = 0; i < transactions.fromWeb3.length; i++) {
        try {
            var transaction = {
                hash: transactions.fromWeb3[i].hash,
                toAddress: transactions.fromWeb3[i].from,
                fromAddress: transactions.fromWeb3[i].to,
                eth: Number(transactions.fromWeb3[i].value),
                gasUsed: Number(transactions.fromWeb3[i].gasPrice),
                blockNumber: Number(transactions.fromWeb3[i].blockNumber),
                info: transactions.fromWeb3[i].input
            }
            transactionObjectsToSave.push(transaction);
            TransactionService.createTransaction(transaction);

        } catch (e) {
            return res.status(400).json({ status: 400, message: "Transaction retrieval from the Ethereum network failed. e: " + e.message })
        }
    }

    // Merge the transactions that came from the DB with the ones that came from Web3. 
    output = transactions.fromWeb3.concat(transactions.fromDatabase);
    console.log('Finally returning ' + output.length + ' transaction objects. ');

    try {
        return res.status(200).json(output)
    } catch (e) {
        return res.status(500).json({ status: 500, message: e.message })
    }

}

