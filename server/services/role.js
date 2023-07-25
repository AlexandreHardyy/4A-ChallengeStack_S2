const { Role } = require("../db/models")

module.exports = {
  findAll: async function () {
    return Role.findAll()
  },
  findById: async function (id) {
    return Role.findByPk(id)
  },
  create: async function (data) {
    return Role.create(data)
  },
  update: async function (criteria, data) {
    const [nb, roles = []] = await Role.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true,
    })
    return roles
  },
  remove: async function (criteria) {
    return Role.destroy({
      where: criteria,
    })
  },
}
