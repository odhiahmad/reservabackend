const { updatePegawai,getPegawai,getPegawaiById } = require("./pegawai.controller");
const router = require("express").Router();
const {checkToken} = require("../../auth/token_validation");

router.patch("/updatePegawai",checkToken,updatePegawai);
router.get("/getPegawai",checkToken,getPegawai);
router.get("/getPegawaiById/:id",checkToken,getPegawaiById);


module.exports = router;
