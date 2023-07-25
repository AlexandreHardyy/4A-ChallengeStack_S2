const { Model, DataTypes, literal } = require("sequelize")
const { v4: uuidv4 } = require('uuid')
const TransactionMongo = require('../aggregates/Transaction')
const CompanyModel = require('./Company')
module.exports = function (connection) {
  class Transaction extends Model {
    static generateToken() {
      return uuidv4()
    }
  }

  Transaction.init(
    {
        token: DataTypes.STRING,
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        amount: DataTypes.FLOAT,
        commission: DataTypes.FLOAT,
        currency: DataTypes.STRING,
        status: DataTypes.STRING,
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          onUpdate : DataTypes.NOW,
          field: 'updated_at',
        },
    },
    {
      sequelize: connection,
      tableName: "transaction",
    }
  )

  Transaction.addHook('afterCreate', async (process, options) => {
    const transaction = process.dataValues
    const company = await CompanyModel(connection).findByPk(transaction.companyId)
    const aggregate = new TransactionMongo({
      ...transaction,
      company: company.dataValues,
      operations: [],
      finalAmount: 0,
      transactionHistory: [
        {
          status: transaction.status,
          date: transaction.createdAt
        } 
      ]
    })
    aggregate.save()
  });

  Transaction.addHook('afterUpdate', async (process, options) => {
    const transaction = process.dataValues
    const aggregate = await TransactionMongo.findOne({ id: transaction.id })

    if (aggregate.id) {
      aggregate.status = transaction.status
      aggregate.transactionHistory.unshift({
        status: transaction.status,
        date: transaction.updatedAt
      })

    }
    aggregate.save()
  });

  return Transaction
}
