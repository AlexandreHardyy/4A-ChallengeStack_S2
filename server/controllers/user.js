const userService = require("../services/user")
const roleService = require("../services/role")
const BrevoMail = require("../services/brevo")

module.exports = {
  cget: async (req, res, next) => {
    const {
      _page = 1,
      _itemsPerPage = 10,
      _sort = {},
      ...criteria
    } = req.query
    try {
      const users = await userService.findAll(criteria, {
        offset: (_page - 1) * _itemsPerPage,
        limit: _itemsPerPage,
        order: _sort,
      })
      res.json(users)
    } catch (err) {
      next(err)
    }
  },
  post: async (req, res, next) => {
    try {
      const [role] = await roleService.findAll({ name: 'admin' })
      const user = await userService.create({
        ...req.body,
        isValid: true,
        roleId: role.id
      })
      res.status(201).json(user)
    } catch (err) {
      next(err)
    }
  },
  get: async (req, res, next) => {
    try {
      const user = await userService.findById(parseInt(req.params.id))
      if (!user) return res.sendStatus(404)
      res.json(user)
    } catch (err) {
      next(err)
    }
  },
  getMe: async (req, res, next) => {
    try {
      const user = await userService.findById(parseInt(req.user.id), { attributes: { exclude: ['password'] } })
      if (!user) return res.sendStatus(404)
      res.json(user)
    } catch (err) {
      next(err)
    }
  },
  patch: async (req, res, next) => {
    const { user, params } = req
    const body = req.body
    if (params.id !== user.id && !user.isAdmin) {
      return res.sendStatus(403)
    }
    if ('roleId' in body && !user.isAdmin) { delete body.roleId}
    if ('isValid' in body && !user.isAdmin) { delete body.isValid}

    const id = params.id
    try {
      const [user] = await userService.update(
        { id: parseInt(id) },
        req.body
      )
      if (!user) return res.sendStatus(404)
      if (user && req.body.isValid) {
        await BrevoMail.mailValidationAccount(user.dataValues)
      }
      return res.json(user)
    } catch (err) {
      next(err)
    }
  },
  delete: async (req, res, next) => {
    try {
      const nbRemoved = await userService.remove({
        id: parseInt(req.params.id),
      })
      res.sendStatus(nbRemoved ? 204 : 404)
    } catch (err) {
      next(err)
    }
  },
}
