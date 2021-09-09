const { verify } = require("jsonwebtoken");

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get("Authorization");
        if (token) {
            token = token.slice(7);
            verify(token, "bangpramggkesayanganistridanrizkijualmadudikantorharganya75ribusaja", (err, decoded) => {
                if (err) {
                    res.status(401).json({
                        berhasil: false,
                        pesan: 'Token tidak benar'
                    })
                } else {
                    req.user = decoded.result
                    next();
                }
            });
        } else {
            res.json({
                berhasil: 0,
                pesan: 'Akses di Tolak!, User tidak dikenal'
            })
        }
    }
}