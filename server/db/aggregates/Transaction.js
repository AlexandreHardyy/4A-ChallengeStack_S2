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
        name: String,
        kbis: String,
        address: String,
        urlDirectionConfirm: String,
        urlDirectionCancel: String,
        clientToken: String,
        apiToken: String,
        createdAt: Date,
        updatedAt: Date
    }
}, { typeKey: '$type' });

module.exports = mongoose.model('Transaction', Transaction);