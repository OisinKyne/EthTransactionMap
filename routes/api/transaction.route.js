
var express = require('express')

var router = express.Router()

// Getting the Transaction Controller that we just created

var TransactionController = require('../../controllers/transaction.controller');


// Map each API to the Controller FUnctions

router.get('/', TransactionController.getTransactions)

router.post('/', TransactionController.createTransaction)

router.put('/', TransactionController.updateTransaction)

router.delete('/:id',TransactionController.removeTransaction)

router.get('/geth', TransactionController.gethTransaction)


// Export the Router

module.exports = router;
