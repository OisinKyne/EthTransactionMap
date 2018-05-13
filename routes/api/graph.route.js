
var express = require('express')

var router = express.Router()

// Getting the Transaction Controller that we just created

var TransactionController = require('../../controllers/transaction.controller');
var GraphController = require('../../controllers/graph.controller')

// Map each API to the Controller FUnctions

//router.get('/', GraphController.getTransactions)

router.post('/', GraphController.getTransactions);

//router.put('/', TransactionController.updateTransaction)


// Export the Router

module.exports = router;
