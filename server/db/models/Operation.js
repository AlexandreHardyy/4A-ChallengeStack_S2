const { Model, DataTypes } = require("sequelize")
const TransactionMongo = require('../aggregates/Transaction')

module.exports = function (connection) {
  class Operation extends Model {}

  Operation.init(
    {
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
      tableName: "operation",
    }
  )

  Operation.addHook('afterCreate', async (process, options) => {
    const operation = process.dataValues
    const aggregate = await TransactionMongo.findOne({ id: operation.transactionId })
    if (aggregate.id) {
      aggregate.operations.unshift(operation)
    }
    aggregate.save()
  });

  return Operation
}
