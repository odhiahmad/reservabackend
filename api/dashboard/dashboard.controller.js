const model = require('../../models/index');
const { Op, QueryTypes, Sequelize } = require("sequelize");
const { sequelize } = require('../../models/index');

module.exports = {
    dashboardHome: async (req, res, next) => {
        try {

            const aktif = await model.user.findAndCountAll({
                where: {
                    status: 1
                },
                limit: 80000
            });
            const nonAktif = await model.user.findAndCountAll({
                where: {
                    status: 0
                },
                limit: 80000
            });
            const total = await model.user.findAndCountAll({
                limit: 80000
            });
            const role = await model.role.findAndCountAll({
                limit: 80000
            });

            const data = [{
                jumlahUser: total.count,
                aktif: aktif.count,
                nonAktif: nonAktif.count,
                role: role.count

            }];
            res.status(200).json({
                'status': 'OK',
                data: data,
            })

        } catch (err) {
            res.status(400).json({
                'status': 'ERROR',
                'messages': err.message,
                'data': {},
            })
        }
    }
}