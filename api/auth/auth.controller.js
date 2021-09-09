const model = require('../../models/index');
const { compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
module.exports = {
    login: async (req, res, next) => {
        const body = req.body;
        try {
            const results = await model.user.findOne({
                where: {
                    email: body.email,
                    status: 1,
                },
                include: ['roleUser']
            });
            if (results) {
                const result = compareSync(body.password, results.password);
                if (result) {
                    results.password = undefined;
                    const jsonToken = sign({ result: results }, "bangpramggkesayanganistridanrizkijualmadudikantorharganya75ribusaja", { expiresIn: "1d" });

                    return res.json({
                        berhasil: true,
                        pesan: 'Login Berhasil',
                        data: results,
                        token: jsonToken,
                    });
                } else {
                    return res.json({
                        berhasil: false,
                        pesan: 'Email atau Password salah'
                    })
                }
            } else {
                return res.json({
                    berhasil: false,
                    pesan: "Akun tidak terdaftar"
                });
            }
        }
        catch (err) {
            res.json({
                pesan: err.message,
                berhasil: false,
                'status': 'ERROR',
                'messages': err.message,
                'data': {}
            })
        }

    }
}