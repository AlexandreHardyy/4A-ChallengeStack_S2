const { Transaction, ...db } = require("../db")
const { Op } = require('sequelize');
const TransactionMongo = require('../db/aggregates/Transaction')

module.exports = {
  findAll: async function (criteria, options = {}) {
    const where = criteria.from !== undefined && criteria.to !== undefined ? 
    { createdAt: { $gte: new Date(criteria.from).setHours(0,0,0), $lte: new Date(criteria.to).setHours(23,59,59) } } : {}


    if (criteria.companyId) {
      where["company.id"] = criteria.companyId
    }

    return TransactionMongo.find(where)
      .sort(options.order ? { [options.order]: 'desc' } : {})
      .skip(options.offset)
      .limit(options.limit)
  
  },
  findById: async function (id) {
    return TransactionMongo.findOne({ id })
  },
  findByToken: async function (token) {
    return TransactionMongo.findOne({ token })
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
    return transactions
  },
  remove: async function (criteria) {
    return Transaction.destroy({
      where: criteria,
    })
  },
}
