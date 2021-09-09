const model = require('../../models/index');
const { Op } = require("sequelize");
const AccessControl = require("accesscontrol");
module.exports = {
    grantAccess: function (action, resource) {
        return async (req, res, next) => {
            try {
                const roleUser = req.user.roleUser.nama;
                const role = await model.fungsi.findAll({
                    where: {
                        idRole: req.user.roleUser.id
                    },
                    include: ['userFungsi']
                });

                const dataRole = [];
                var nomor = 0;
                for (let i = 0; i < role.length; i++) {
                    for (let j = 0; j < role[i].fungsi.length; j++) {


                        dataRole[nomor] = {
                            role: roleUser,
                            resource: role[i].userFungsi.nama,
                            action: role[i].fungsi[j],
                            attributes: '*'
                        }
                        nomor++;
                    }
                }
                const ac = new AccessControl(dataRole);
                const permission = ac.can(roleUser)[action](resource);
                if (!permission.granted) {
                    return res.status(401).json({
                        error: "Oppsss, anda tidak punya akses untuk kesini!",
                        data: []
                    });
                }
                next()

            } catch (error) {
                next(error)
            }
        }
    },
    createFungsi: async (req, res, next) => {
        try {
            const body = req.body.data;

            const dataFungsi = [];
            var nomor = 0;
            for (let i = 0; i < body.menu.length; i++) {
                dataFungsi[nomor] = {
                    idRole: body.id,
                    idMenu: body.menu[i].id,
                    keterangan: body.nama,
                    fungsi: ['read', 'update', 'delete', 'create'],
                    status: 1,

                }
                nomor++;
            }

            const fungsi = await model.fungsi.bulkCreate(
                dataFungsi
            );

            res.status(200).json({
                berhasil: true,
                'status': 'OK',
                'messages': 'Fungsi berhasil ditambahkan',
                'data': fungsi,
            })
        } catch (err) {
            res.status(400).json({
                'status': 'ERROR',
                'messages': err.message,
                'data': {},
            })
        }
    },
    editFungsi: async (req, res, next) => {
        try {
            const body = req.body.data;
            await model.fungsi.update({
                fungsi: body.fungsi,
                idMenu: body.idMenu,
                idRole: body.idRole,


            }, {
                where: {
                    id: body.id
                }
            });
            res.status(200).json({
                berhasil: true,
                'status': 'OK',
                'messages': 'Fungsi berhasil ditambahkan',

            })

        } catch (err) {
            res.status(400).json({
                'status': 'ERROR',
                'messages': err.message,
                'data': {},
            })
        }
    },
    getFungsiById: async (req, res, next) => {
        const id = req.params.id;
        try {
            const fungsi = await model.fungsi.findByPk(id);
            if (fungsi.length !== 0) {
                res.json({
                    'status': 'OK',
                    berhasil: true,
                    'messages': '',
                    'data': fungsi
                })
            } else {
                res.json({
                    'status': 'ERROR',
                    berhasil: true,
                    'messages': 'EMPTY',
                    'data': {}
                })
            }
        } catch (err) {
            res.json({
                berhasil: false,
                'status': 'ERROR',
                'messages': err.message,
                'data': {}
            })
        }
    },
    getFungsidanMenuByRole: async (req, res, next) => {
        const id = req.params.id;
        try {
            const menuUser = await model.fungsi.findAll({
                where: {
                    idRole: id
                },
                include: ['userFungsi']
            })

            const dataMenu = [];
            var nomor = 0;
            for (let i = 0; i < menuUser.length; i++) {

                if (menuUser[i].userFungsi.statusMenu === 0) {
                    dataMenu[nomor] = {
                        id: menuUser[i].userFungsi.id,
                        idMenu: menuUser[i].userFungsi.idMenu,
                        nama: menuUser[i].userFungsi.nama,
                        keterangan: menuUser[i].userFungsi.keterangan,
                        icon: menuUser[i].userFungsi.icon,
                        fungsi: menuUser[i].fungsi,
                        anak: []
                    }
                    for (let j = 0; j < menuUser.length; j++) {
                        if (menuUser[i].idMenu === menuUser[j].userFungsi.idMenu) {
                            dataMenu[nomor]['anak'].push({
                                id: menuUser[j].userFungsi.id,
                                idMenu: menuUser[j].userFungsi.idMenu,
                                nama: menuUser[j].userFungsi.nama,
                                keterangan: menuUser[j].userFungsi.keterangan,
                                icon: menuUser[j].userFungsi.icon,
                                fungsi: menuUser[j].fungsi,
                            })
                        }
                    }
                    nomor++;
                }


            }

            res.json({
                'status': 'OK',
                berhasil: true,
                'messages': '',
                'data': dataMenu,
            })
        } catch (err) {
            res.json({
                berhasil: false,
                'status': 'ERROR',
                'messages': err.message,
                'data': {}
            })
        }
    },
    getFungsi: async (req, res, next) => {
        const body = req.body;

        try {
            const fungsi = await model.fungsi.findAndCountAll({
                where: {
                    keterangan: {
                        [Op.like]: `%${body.cari}%`
                    }
                },
                offset: parseInt(body.page), limit: parseInt(body.size), order: [
                    [body.sortField, body.sortOrder],
                ],

            });

            if (fungsi.length !== 0) {
                res.json({
                    'status': 'OK',
                    berhasil: true,
                    totalPage: fungsi.count,
                    limit: body.size,
                    page: body.page,
                    'data': fungsi,

                })
            } else {
                res.json({
                    'status': 'ERROR',
                    berhasil: true,
                    'messages': 'EMPTY',
                    'data': {}
                })
            }
        } catch (err) {
            res.json({
                berhasil: false,
                'status': 'ERROR',
                'messages': err.message,
                'data': {}
            })
        }
    },



    deleteFungsi: async (req, res, next) => {
        try {
            const fungsiId = req.params.id;
            const fungsi = await model.fungsi.destroy({
                where: {
                    id: fungsiId
                }
            })
            if (fungsi) {
                res.json({
                    'status': 'OK',
                    'messages': 'Fungsi berhasil dihapus',
                    'data': fungsi,
                })
            }
        } catch (err) {
            res.status(400).json({
                'status': 'ERROR',
                'messages': err.message,
                'data': {},
            })
        }
    },

}