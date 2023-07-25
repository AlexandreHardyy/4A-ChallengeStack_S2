'use strict';

const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('User', {
        id: Sequelize.INTEGER,
        lastname: Sequelize.STRING,
        firstname: Sequelize.STRING,
        email: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false,
            validate: {
            isEmail: true, isNotNull: function (value) {
              if (value === null) {
                throw new Error("Email cannot be null")
              }
            }
          }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        isValid: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            onUpdate : Sequelize.NOW,
            field: 'updated_at',
        }
    })

    await queryInterface.addIndex('Company', {
        id: Sequelize.INTEGER,
        name: DataTypes.STRING,
        kbis: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        address: Sequelize.STRING,
        urlDirectionConfirm: Sequelize.STRING,
        urlDirectionCancel: Sequelize.STRING,
        clientToken: Sequelize.STRING,
        apiToken: Sequelize.STRING,
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            onUpdate : Sequelize.NOW,
            field: 'updated_at',
        },
    })

    await queryInterface.addIndex('Transaction', {
        id: Sequelize.INTEGER,
        token: Sequelize.STRING,
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        amount: Sequelize.FLOAT,
        commission: Sequelize.FLOAT,
        currency: Sequelize.STRING,
        status: Sequelize.STRING,
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            onUpdate : Sequelize.NOW,
            field: 'updated_at',
        },
    })

    await queryInterface.addIndex('Role', {
        name: Sequelize.STRING
    })

    await queryInterface.addIndex('Operation', {
        type: Sequelize.STRING,
        status: Sequelize.STRING,
        amount: Sequelize.FLOAT,
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            onUpdate : Sequelize.NOW,
            field: 'updated_at',
        },
    })

    await queryInterface.addIndex('OperationHistory', {
        status: Sequelize.STRING,
        date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            field: 'created_at',
        }
    })

    await queryInterface.addIndex('TransactionHistory', {
        status: Sequelize.STRING,
        date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            field: 'created_at',
        }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
