const jwt = require('jsonwebtoken')

const userAuth = (...params) => {
  return authProcess(...params)
}

const adminAuth = (...params) => {
  return authProcess(...params, true)
}

const authProcess = (req, res, next, isAdmin = false) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.sendStatus(401)

  return jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err) return res.sendStatus(403)
    req.user = user

    if (isAdmin && (!req.user.role || req.user.role !== 'admin')) return res.sendStatus(403)

    next()
  })
}

module.exports = { userAuth, adminAuth }