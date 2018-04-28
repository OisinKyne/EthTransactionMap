
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
        
        // Return the transactions list that was retured by the mongoose promise
        return transactions;

    } catch (e) {
        console.log(e);
        // return a Error message describing the reason 
        throw Error('Error while Paginating Transactions')
    }
}

exports.createTransaction = async function(transaction){
    
    // Creating a new Mongoose Object by using the new keyword
    var newTransaction = new Transaction({
        hash: transaction.hash,
        toAddress: transaction.toAddress,
        fromAddress: transaction.fromAddress,
        date: new Date(),
        eth: transaction.eth,
        gasUsed: transaction.gasPrice,
        blockNumber: transaction.blockNumber,
        info: transaction.info
    })

    try{

        // Saving the Todo 
        var savedTransaction = await newTransaction.save()

        return savedTransaction;
    }catch(e){
      
        // return a Error message describing the reason     
        throw Error("Error while Saving Transaction")
    }
}

// exports.updateTransaction = async function(transaction){
//     var id = transaction.id

//     try{
//         //Find the old Transaction Object by the Id
    
//         var oldTransaction = await Transaction.findById(id);
//     }catch(e){
//         throw Error("Error occured while Finding the Transaction")
//     }

//     // If no old Transaction Object exists return false
//     if(!oldTransaction){
//         return false;
//     }

//     console.log(oldTransaction)

//     //Edit the Todo Object
//     oldTodo.title = todo.title
//     oldTodo.description = todo.description
//     oldTodo.status = todo.status


//     console.log(oldTodo)

//     try{
//         var savedTodo = await oldTodo.save()
//         return savedTodo;
//     }catch(e){
//         throw Error("And Error occured while updating the Todo");
//     }
// }

// exports.deleteTodo = async function(id){
    
//     // Delete the Todo
//     try{
//         var deleted = await ToDo.remove({_id: id})
//         if(deleted.result.n === 0){
//             throw Error("Todo Could not be deleted")
//         }
//         return deleted
//     }catch(e){
//         throw Error("Error Occured while Deleting the Todo")
//     }
// }
