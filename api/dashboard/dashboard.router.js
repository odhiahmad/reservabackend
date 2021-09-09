const { dashboardHome } = require("./dashboard.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");


router.get("/dashboardHome", checkToken, dashboardHome);


module.exports = router;
