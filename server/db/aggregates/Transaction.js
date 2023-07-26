const mongoose = require('mongoose');
const { Schema } = mongoose;

const Transaction = new Schema({
    id: Number,
    token: String,
    name: String,
    email: String,
    amount: Number,
    finalAmount: Number,
    commission: Number,
    currency: String,
    status: String,
    createdAt: Date,
    updatedAt: Date,
    operations: [
        {
            id: Number,
            type: String,
            status: String,
            createdAt: Date,
            updatedAt: Date,
            amount: Number,

            operationHistory: [
                {
                    status: String,
                    date: String
                }
            ]
        }
    ],
    transactionHistory: [
        {
            status: String,
            date: Date
        }
    ],
    company: {
        id: Number,
        name: String,
        kbis: String,
        address: String,
        url: String,
        urlDirectionConfirm: String,
        urlDirectionCancel: String,
        clientToken: String,
        apiToken: String,
        createdAt: Date,
        updatedAt: Date
    }
}, { typeKey: '$type' });

module.exports = mongoose.model('Transaction', Transaction);