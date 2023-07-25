const { Role } = require("../db")

module.exports = {
  findAll: async function (filter) {
    return Role.findAll(filter ?? {})
  }
}
