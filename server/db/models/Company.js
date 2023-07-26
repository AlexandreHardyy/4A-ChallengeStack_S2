const { Model, DataTypes } = require('sequelize')
const { v4: uuidv4 } = require('uuid')

module.exports = function (connection) {
  class Company extends Model {
    static generateToken() {
      return uuidv4()
    }
  }

  Company.init(
    {
        name: DataTypes.STRING,
        kbis: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        },
        address: DataTypes.STRING,
        url: DataTypes.STRING,
        urlDirectionConfirm: DataTypes.STRING,
        urlDirectionCancel: DataTypes.STRING,
        clientToken: DataTypes.STRING,
        apiToken: DataTypes.STRING,
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
      tableName: "company",
    }
  )

  

  return Company
}
