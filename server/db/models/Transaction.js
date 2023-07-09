const { Model, DataTypes, literal } = require("sequelize")
const { v4: uuidv4 } = require('uuid')

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
        // bankCode1: DataTypes.STRING,
        // bankCode2: DataTypes.STRING,
        amount: DataTypes.FLOAT,
        commission: DataTypes.FLOAT,
        currency: DataTypes.STRING,
        urlDirectionConfirm: DataTypes.STRING,
        urlDirectionCancel: DataTypes.STRING,
        // clientToken: DataTypes.STRING,
        // clientSecret: DataTypes.STRING,
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
