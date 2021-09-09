const { grantAccess, createMenu, getMenu, getMenuById, deleteMenu, aktifMenu, nonAktifMenu, aktifMenuBanyak, nonAktifMenuBanyak, editMenu, getMenuAll } = require("./masterMenu.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");


router.post("/createMenu", checkToken, grantAccess('createAny', 'menu'), createMenu);
router.patch("/editMenu", checkToken, grantAccess('updateAny', 'menu'), editMenu);
router.post("/getMenu", checkToken, grantAccess('readAny', 'menu'), getMenu);
router.post("/aktifMenuBanyak", checkToken, grantAccess('updateAny', 'menu'), aktifMenuBanyak);
router.post("/nonAktifMenuBanyak", checkToken, grantAccess('updateAny', 'menu'), nonAktifMenuBanyak);
router.get("/getMenuById/:id", checkToken, grantAccess('readAny', 'menu'), getMenuById);
router.get("/getMenuAll", checkToken, grantAccess('readAny', 'menu'), getMenuAll);
router.delete("/deleteMenu", checkToken, grantAccess('deleteAny', 'menu'), deleteMenu);
module.exports = router;
