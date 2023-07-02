const { Transaction } = require("../db")

module.exports = {
  findAll: async function (criteria, options = {}) {
    return Transaction.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    })
  },
  findById: async function (id, options) {
    return Transaction.findOne({
      where: {
        id
      },
      ...options
    })
  },
  create: async function (data) {
    return Transaction.create(data)
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
