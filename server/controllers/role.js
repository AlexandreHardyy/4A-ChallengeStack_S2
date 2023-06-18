const roleService = require("../services/role")

module.exports = {
  cget: async (req, res, next) => {
    try {
      const roles = await roleService.findAll()
      res.json(roles)
    } catch (err) {
      next(err)
    }
  },
  post: async (req, res, next) => {
    try {
      const role = await roleService.create(req.body)
      res.status(201).json(role)
    } catch (err) {
      next(err)
    }
  },
  get: async (req, res, next) => {
    try {
      const role = await roleService.findById(parseInt(req.params.id))
      if (!role) return res.sendStatus(404)
      res.json(role)
    } catch (err) {
      next(err)
    }
  },
  patch: async (req, res, next) => {
    try {
      const [role] = await roleService.update(
        { id: parseInt(req.params.id) },
        req.body
      )
      if (!role) return res.sendStatus(404)
      res.json(role)
    } catch (err) {
      next(err)
    }
  },
  delete: async (req, res, next) => {
    try {
      const nbRemoved = await roleService.remove({
        id: parseInt(req.params.id),
      })
      res.sendStatus(nbRemoved ? 204 : 404)
    } catch (err) {
      next(err)
    }
  },
}
