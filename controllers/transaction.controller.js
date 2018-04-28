
// Accessing the Service that we just created

var TransactionService = require('../services/transaction.service')

// Saving the context of this module inside the _the variable

_this = this


// Async Controller function to get the To do List

exports.getTransactions = async function(req, res, next){

    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10; 

    try{
    
        var transactions = await TransactionService.getTransactions({}, page, limit)
        
        // Return the transactions list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: transactions, message: "Succesfully Transactions Recieved"});
        
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: e.message});
        
    }
}

exports.createTransaction = async function(req, res, next){

    // Req.Body contains the form submit values.

    var transaction = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status
    }

    try{
        
        // Calling the Service function with the new object from the Request Body
    
        var createdTransaction = await TransactionService.createTransaction(transaction)
        return res.status(201).json({status: 201, data: createdTransaction, message: "Succesfully Created Transaction"})
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: "Transaction Creation was Unsuccesfull"})
    }
}
