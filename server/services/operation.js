const { Operation } = require("../db")

module.exports = {
  findAll: async function (criteria, options = {}) {
    return Operation.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    })
  },
  findById: async function (id) {
    return Operation.findByPk(id)
  },
  create: async function (data) {
    return Operation.create(data)
  },
  update: async function (criteria, data) {
    const [nb, operations = []] = await Operation.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true,
    })
    console.log(nb, operations)
    return operations
  },
  remove: async function (criteria) {
    return Operation.destroy({
      where: criteria,
    })
  },
}
