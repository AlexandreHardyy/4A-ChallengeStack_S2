const { Model, DataTypes } = require("sequelize")
const bcrypt = require("bcryptjs");

module.exports = function (connection) {
  class User extends Model {
    async checkPassword(password) {
      const bcrypt = require("bcryptjs")
      return bcrypt.compare(password, this.password)
    }

    generateToken() {
      const jwt = require("jsonwebtoken")
      return jwt.sign({ id: this.id, isAdmin: this?.Role?.name === 'admin', companyId: this.companyId }, process.env.JWT_SECRET, {
        expiresIn: "1y",
      })
    }
  }

  User.init(
    {
      lastname: DataTypes.STRING,
      firstname: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          isNotNull: function (value) {
            if (value === null) {
              throw new Error("Email cannot be null")
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 8,
          is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*\.])/,
        },
      },
      isValid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
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
      tableName: "user",
    }
  )

  async function encryptPassword(user, options) {
    if (!options?.fields.includes("password")) {
      return
    }
    const bcrypt = require("bcryptjs")
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, salt)
    user.password = hash
  }

  User.addHook("beforeCreate", encryptPassword)
  User.addHook("beforeUpdate", encryptPassword)

  return User
}
