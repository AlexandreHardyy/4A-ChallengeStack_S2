const { Model, DataTypes } = require("sequelize")
const TransactionMongo = require('../aggregates/Transaction')

module.exports = function (connection) {
  class Operation extends Model {}

  Operation.init(
    {
      type: DataTypes.STRING,
      status: DataTypes.STRING,
      amount: DataTypes.FLOAT,
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
      tableName: "operation",
    }
  )

  Operation.addHook('afterCreate', async (process, options) => {
    const operation = process.dataValues
    const aggregate = await TransactionMongo.findOne({ id: operation.transactionId })
    if (aggregate.id) {
      aggregate.operations.unshift({
        ...operation,
        operationHistory: [{
          status: operation.status,
          date: operation.createdAt
        }]
      })
    }
    aggregate.save()
  });

  Operation.addHook('afterUpdate', async (process, options) => {
    const operation = process.dataValues
    const aggregate = await TransactionMongo.findOne({ id: operation.transactionId })
    
    if (aggregate.id) {
      const indexOperator = aggregate.operations.findIndex(op => op.id === operation.id)

      Object.assign(aggregate.operations[indexOperator], operation)
      aggregate.operations[indexOperator].operationHistory.unshift({
        status: operation.status,
        date: operation.updatedAt
      })

    }
    aggregate.save()
  });

  return Operation
}
