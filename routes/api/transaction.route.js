
var express = require('express')

var router = express.Router()

// Getting the Transaction Controller that we just created

var ToDoController = require('../../controllers/transaction.controller');


// Map each API to the Controller FUnctions

router.get('/', ToDoController.getTransactions)

router.post('/', ToDoController.createTransaction)


// Export the Router

module.exports = router;
