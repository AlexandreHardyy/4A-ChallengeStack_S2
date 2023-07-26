const ValidationError = require("../errors/ValidationError");

module.exports = function (err, req, res, next) {
  console.log(err)
  if (req.method === 'POST' && Object.keys(req.body).length === 0) {
    res.sendStatus(400)
  }else if (err instanceof ValidationError) {
    res.status(422).json(err.errors);
  }else if (err.name = "SequelizeUniqueConstraintError") {
    res.status(409).json(err.errors);
  } else {
    res.sendStatus(500);
  }
};
