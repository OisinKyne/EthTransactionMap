
// Accessing the Service that we just created

var TransactionService = require('../services/transaction.service')
var GethService = require('../services/geth.service')

// Saving the context of this module inside the _the variable

_this = this


// Async Controller function to get the To do List

exports.getTransactions = async function (req, res, next) {

    // Check the existence of the query parameters, If the exists doesn't exists assign a default value

    var page = req.query.page ? parseInt(req.query.page) : 1
    var limit = req.query.limit ? parseInt(req.query.limit) : 10;

    try {

        var transactions = await TransactionService.getTransactions({}, page, limit)
        // Return the transactions list with the appropriate HTTP Status Code and Message.


        return res.status(200).json({ status: 200, data: transactions, message: "Succesfully Transactions Recieved" });

    } catch (e) {

        //Return an Error Response Message with Code and the Error Message.

        return res.status(400).json({ status: 400, message: e.message });

    }
}

exports.createTransaction = async function (req, res, next) {

    // Req.Body contains the form submit values.

    try {
        var transaction = {
            hash: req.headers.hash,
            toAddress: req.headers.toaddress,
            fromAddress: req.headers.fromaddress,
            eth: Number(req.headers.eth),
            gasUsed: Number(req.headers.gasused),
            blockNumber: Number(req.headers.blocknumber),
            info: req.headers.info
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Transaction Object Creation Failed." })
    }

    try {

        // Calling the Service function with the new object from the Request Body

        var createdTransaction = await TransactionService.createTransaction(transaction)
        return res.status(201).json({ status: 201, data: createdTransaction, message: "Succesfully Created Transaction" })
    } catch (e) {

        //Return an Error Response Message with Code and the Error Message.

        return res.status(400).json({ status: 400, message: "Transaction Creation was Unsuccesfull" })
    }
}

exports.gethTransaction = async function (req, res, next) { 
    // Testing connection to geth for a transaction hash.
    console.log('Geth Transaction Request:')
    console.log(req.query);
    var hash = req.query.hash === null ? 'wronghash' : req.query.hash;
    console.log(hash);

    var gethTransaction = GethService.findTransaction(hash).then( (geth) => {
        console.log('Controller Callback fired.');
        return res.status(200).json({status:200, geth:geth})
        //return res.status(200).json({status:200, fromAddress:gethTransaction.fromaddress, toAddress:gethTransaction.toaddress})
    });

    // console.log('GethTransaction service returned: ');
    // console.log(gethTransaction)
    // console.log(typeof(gethTransaction));

    
    
}

exports.updateTransaction = async function(req, res, next){

    // Id is necessary for the update

    if(!req.body._id){
        return res.status(400).json({status: 400., message: "Id must be present"})
    }

    var id = req.body._id;

    console.log(req.body)

    var transaction = {
        id,
        title: req.body.title ? req.body.title : null,
        description: req.body.description ? req.body.description : null,
        status: req.body.status ? req.body.status : null
    }

    try{
        var updatedTransaction = await TransactionService.updateTransaction(transaction)
        return res.status(200).json({status: 200, data: updatedTransaction, message: "Succesfully Updated Tod"})
    }catch(e){
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.removeTransaction = async function(req, res, next){

    var id = req.params.id;

    try{
        var deleted = await TransactionService.deleteTransaction(id)
        return res.status(204).json({status:204, message: "Succesfully Transaction Deleted"})
    }catch(e){
        return res.status(400).json({status: 400, message: e.message})
    }

}