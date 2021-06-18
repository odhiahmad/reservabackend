const { statistikDashboard } = require("./statistik.controller");
const router = require("express").Router();
const {checkToken} = require("../../auth/token_validation");

router.get("/statistikDashboard/:id",checkToken,statistikDashboard);



module.exports = router;