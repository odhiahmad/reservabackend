const { createRole, grantAccess, getRole, getRoleById, deleteRole, aktifRoleBanyak, nonAktifRoleBanyak, editRole, getRoleAll } = require("./masterRole.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");


router.post("/createRole", checkToken, grantAccess('createAny', 'role'), createRole);
router.patch("/editRole", checkToken, grantAccess('updateAny', 'role'), editRole);
router.post("/getRole", checkToken, grantAccess('readAny', 'role'), getRole);
router.post("/aktifRoleBanyak", checkToken, grantAccess('updateAny', 'role'), aktifRoleBanyak);
router.post("/nonAktifRoleBanyak", checkToken, grantAccess('updateAny', 'role'), nonAktifRoleBanyak);
router.get("/getRoleById/:id", checkToken, grantAccess('readAny', 'role'), getRoleById);
router.get("/getRoleAll", checkToken, grantAccess('readAny', 'role'), getRoleAll);




module.exports = router;
