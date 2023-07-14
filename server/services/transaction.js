const { Transaction, ...db } = require("../db")
const { Op } = require('sequelize');

module.exports = {
  findAll: async function (criteria, options = {}) {
    const where = criteria.from !== 'undefined' && criteria.to !== 'undefined' ? {
      createdAt: {
        [Op.between]: [new Date(criteria.from).setHours(0,0,0), new Date(criteria.to).setHours(23,59,59)]
      }
     } : undefined
    return Transaction.findAll({
      where,
      ...options,
      include: db.Operation,
      order: Object.entries(options.order || {}),
    })
  },
  findById: async function (id) {
    return Transaction.findOne({
      where: {
        id
      },
      include: db.Operation
    })
  },
  findByToken: async function (token) {
    return Transaction.findOne({
      where: {
        token
      },
      include: db.Operation
    })
  },
  create: async function (data) {
    return Transaction.create({
      ...data,
      token: Transaction.generateToken()
    })
  },
  update: async function (criteria, data) {
    const [nb, transactions = []] = await Transaction.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true,
    })
    console.log(nb, transactions)
    return transactions
  },
  remove: async function (criteria) {
    return Transaction.destroy({
      where: criteria,
    })
  },
}
