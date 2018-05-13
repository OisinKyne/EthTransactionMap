
var express = require('express')

var router = express.Router()
var transactions = require('./api/transaction.route')
var graph = require('./api/graph.route')

router.use('/transactions', transactions);
router.use('/graph', graph);


module.exports = router;
