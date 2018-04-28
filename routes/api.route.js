
var express = require('express')

var router = express.Router()
var transactions = require('./api/transaction.route')


router.use('/transactions', transactions);


module.exports = router;
