const { Model, DataTypes } = require("sequelize")

module.exports = function (connection) {
  class TransactionHistory extends Model {}

  TransactionHistory.init(
    {
      status: DataTypes.STRING,
    },
    {
      sequelize: connection,
      tableName: "transactionHistory",
    }
  )
  return TransactionHistory
}