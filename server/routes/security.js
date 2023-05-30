const { Router } = require("express");

module.exports = function (userService) {
  const router = Router();

  router.post("/login", async function (req, res) {
    const { email, password } = req.body;
    const [user] = await userService.findAll({ email });
    if (!user) {
      return res.sendStatus(401);
    }
    if (!user.checkPassword(password)) {
      return res.sendStatus(401);
    }

    res.json({ token: user.generateToken() });
  });

  return router;
};
