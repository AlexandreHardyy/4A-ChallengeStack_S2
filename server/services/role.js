const { Role } = require("../db/models")

module.exports = {
  findAll: async function (filter) {
    return Role.findAll(filter ?? {})
  }
}
