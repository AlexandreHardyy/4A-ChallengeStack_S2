const { Model, DataTypes, literal } = require("sequelize")

module.exports = function (connection) {
  class Transaction extends Model {}

  Transaction.init(
    {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        bankCode1: DataTypes.STRING,
        bankCode2: DataTypes.STRING,
        amount: DataTypes.STRING,
        currency: DataTypes.STRING,
        urlDirectionConfirm: DataTypes.STRING,
        urlDirectionCancel: DataTypes.STRING,
        clientToken: DataTypes.STRING,
        clientSecret: DataTypes.STRING,
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

  return Transaction
}
