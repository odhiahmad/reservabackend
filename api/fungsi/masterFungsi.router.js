const { grantAccess, createFungsi, getFungsiById, deleteFungsi, editFungsi, getFungsi, getFungsidanMenuByRole } = require("./masterFungsi.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.post("/createFungsi", checkToken, grantAccess('createAny', 'role'), createFungsi);
router.patch("/editFungsi", checkToken, grantAccess('updateAny', 'role'), editFungsi);
router.get("/getFungsiById/:id", checkToken, grantAccess('readAny', 'role'), getFungsiById);
router.get("/getFungsidanMenuByRole/:id", checkToken, grantAccess('readAny', 'role'), getFungsidanMenuByRole);
router.post("/getFungsi", checkToken, grantAccess('readAny', 'role'), getFungsi);
router.delete("/hapusFungsi/:id", checkToken, grantAccess('deleteAny', 'role'), deleteFungsi);

module.exports = router;
