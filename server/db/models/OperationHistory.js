const { Model, DataTypes } = require("sequelize")

module.exports = function (connection) {
  class OperationHistory extends Model {}

  OperationHistory.init(
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
      tableName: "operationHistory",
    }
  )
  return OperationHistory
}