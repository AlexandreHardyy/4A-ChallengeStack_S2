const jwt = require('jsonwebtoken')

const userAuth = (...params) => {
  authProcess(...params)
}

const adminAuth = (...params) => {
  authProcess(...params, true)
}

const authProcess = (req, res, next, isAdmin = false) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    if (isAdmin && (!req.user.role || req.user.role !== 'admin')) return res.sendStatus(403)

    next()
  })
}

module.exports = { userAuth, adminAuth }