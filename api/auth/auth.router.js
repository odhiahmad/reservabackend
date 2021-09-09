const { login } = require("./auth.controller");
const router = require("express").Router();

router.post('/login', login);

module.exports = router;