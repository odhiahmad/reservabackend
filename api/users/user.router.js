const { grantAccess, createUser, getUser, getUserById, aktifUserBanyak, nonAktifUserBanyak, editUser } = require("./user.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.post("/createUser", createUser);
router.post("/getUser", checkToken, grantAccess('readAny', 'user'), getUser);
router.post("/aktifUserBanyak", checkToken, grantAccess('updateAny', 'user'), aktifUserBanyak);
router.post("/nonAktifUserBanyak", checkToken, nonAktifUserBanyak);

router.patch("/editUser", checkToken, grantAccess('updateAny', 'user'), editUser);

router.get("/getUserById/:id", checkToken, grantAccess('readAny', 'user'), getUserById);


module.exports = router;
