const { Model, DataTypes } = require("sequelize")

module.exports = function (connection) {
  class TransactionHistory extends Model {}

  TransactionHistory.init(
    {
      status: DataTypes.STRING,
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      }
    },
    {
      sequelize: connection,
      tableName: "transactionHistory",
    }
  )
  return TransactionHistory
}