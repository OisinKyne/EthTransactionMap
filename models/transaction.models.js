var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


var TransactionSchema = new mongoose.Schema({
    hash: String,
    toAddress: String,
    fromAddress: String,
    date: Date,
    eth: Number,
    gasUsed: Number,
    blockNumber: Number,
    info: String
})

TransactionSchema.plugin(mongoosePaginate)
const Transaction = mongoose.model('Transaction', TransactionSchema)

module.exports = Transaction;