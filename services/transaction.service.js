
var Transaction = require('../models/transaction.models')

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the historic transactions.
exports.getTransactions = async function(query, page, limit){

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
    
    // Try Catch the awaited promise to handle the error 
    
    try {
        var transactions = await Transaction.paginate(query, options)
        console.log('Transactions:');
        var id = transactions.docs[0].id
        console.log(id);
        var transaction = await Transaction.findById(id);
        console.log('New transaction object:');
        console.log(transaction);

        // Return the transactions list that was retured by the mongoose promise
        return transactions;

    } catch (e) {
        console.log(e);
        // return a Error message describing the reason 
        throw Error('Error while Paginating Transactions')
    }
}

 
exports.getTransactionByHash = async function(hash){
    
    try {
        var transaction = await Transaction.findOne({hash:hash});

        console.log('We checked the DB for: ' + hash);
        console.log(transaction);
        return transaction

    } catch (e) {
        console.log(e);
        // return a Error message describing the reason 
        throw Error('Error while searching the DB for hash: ' + hash)
    }
}



exports.createTransaction = async function(transaction){
    try{
    // Creating a new Mongoose Object by using the new keyword
    var newTransaction = new Transaction({
        hash: transaction.hash,
        toAddress: transaction.toAddress,
        fromAddress: transaction.fromAddress,
        date: new Date(),
        eth: transaction.eth,
        gasUsed: transaction.gasUsed,
        blockNumber: transaction.blockNumber,
        info: transaction.info
    })}
    catch(e)
    {
        throw Error('Error creating Transaction Object from post headers.')
    }

    try{

        // Saving the Transaction 
        var savedTransaction = await newTransaction.save()

        return savedTransaction;
    }catch(e){
      
        // return a Error message describing the reason     
        throw Error("Error while Saving Transaction")
    }
}

exports.updateTransaction = async function(transaction){
    var id = transaction.id

    try{
        //Find the old Transaction Object by the Id
    
        var oldTransaction = await Transaction.findById(id);
    }catch(e){
        throw Error("Error occured while Finding the Transaction")
    }

    // If no old Transaction Object exists return false
    if(!oldTransaction){
        return false;
    }

    console.log(oldTransaction)

    //Edit the Transaction Object
    oldTransaction.hash = transaction.hash
    oldTransaction.toAddress = transaction.toAddress
    oldTransaction.fromAddress = transaction.fromAddress
    oldTransaction.date = transaction.date
    oldTransaction.eth = transaction.eth
    oldTransaction.gasUsed = transaction.gasUsed
    oldTransaction.blockNumber = transaction.blockNumber
    oldTransaction.info = transaction.info

    console.log(oldTransaction)

    try{
        var savedTransaction = await oldTransaction.save()
        return savedTransaction;
    }catch(e){
        throw Error("And Error occured while updating the Transaction");
    }
}

exports.deleteTransaction = async function(id){
    
    // Delete the Transaction
    try{
        var deleted = await Transaction.remove({_id: id})
        if(deleted.result.n === 0){
            throw Error("Transaction Could not be deleted")
        }
        return deleted
    }catch(e){
        throw Error("Error Occured while Deleting the Transaction")
    }
}
