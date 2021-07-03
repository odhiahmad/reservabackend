const { cekLokasi, ambilAbsen, getAbsenByIdUser } = require("./absen.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.post("/getLokasi", checkToken, cekLokasi);
router.patch("/ambilAbsen", checkToken, ambilAbsen);
router.post("/ambilAbsen", checkToken, ambilAbsen);

router.post("/getAbsenByIdUser", checkToken, getAbsenByIdUser);

module.exports = router;