const mongoose = require('mongoose');
const { Schema } = mongoose;

const Transaction = new Schema({
    id: Number,
    token: String,
    name: String,
    email: String,
    amount: Number,
    commission: Number,
    currency: String,
    urlDirectionConfirm: String,
    urlDirectionCancel: String,
    createdAt: Date,
    updatedAt: Date,
    operations: [
        {
            status: String,
            createdAt: Date,
            updatedAt: Date
        }
    ],
    companyId: Number
});

module.exports = mongoose.model('Transaction', Transaction);