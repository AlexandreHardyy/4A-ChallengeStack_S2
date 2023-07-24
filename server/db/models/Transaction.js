const { Model, DataTypes, literal } = require("sequelize")
const { v4: uuidv4 } = require('uuid')
const TransactionMongo = require('../aggregates/Transaction')

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

  Transaction.addHook('afterCreate', (process, options) => {
    const transaction = process.dataValues
    const aggregate = new TransactionMongo({
      ...transaction,
      operations: [],
      id: transaction.id
    })
    aggregate.save()
  });

  return Transaction
}
