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
    createMenu: async (req, res, next) => {
        try {
            const body = req.body.data;

            const cek = await model.menu.findAll({
                where: {
                    [Op.and]: [
                        { nama: body.nama },
                        { idMenu: 0 },

                    ]
                }
            })

            const cekIdMenu = await model.menu.findAll({
                where: {
                    [Op.and]: [
                        { nama: body.nama },
                        { idMenu: body.idMenu },

                    ]
                }
            })

            if (cek.length > 0 & parseInt(body.idMenu) === 0) {
                res.status(200).json({
                    berhasil: false,
                    'status': 'OK',
                    'messages': 'Nama menu sudah ada pada folder root',
                    'data': [],
                })
            } else if (cekIdMenu.length > 0 & parseInt(body.idMenu) !== 0) {
                res.status(200).json({
                    berhasil: false,
                    'status': 'OK',
                    'messages': 'Nama menu ' + body.nama + ' sudah ada di anak menu ini',
                    'data': [],
                })
            } else {
                const menu = await model.menu.create({
                    idMenu: body.idMenu,
                    nama: body.nama,
                    icon: body.icon,
                    keterangan: body.keterangan,
                    status: 1,
                    statusMenu: body.statusMenu
                });
                if (menu) {
                    res.status(200).json({
                        berhasil: true,
                        'status': 'OK',
                        'messages': 'Menu berhasil ditambahkan',
                        'data': menu,
                    })
                }
            }
        } catch (err) {
            res.status(400).json({
                'status': 'ERROR',
                'messages': err.message,
                'data': {},
            })
        }
    },
    editMenu: async (req, res, next) => {
        try {
            const body = req.body.data;
            const cek = await model.menu.findAll({
                where: {
                    [Op.and]: [
                        { nama: body.nama },
                        { idMenu: 0 },

                    ]
                }
            })

            const cekIdMenu = await model.menu.findAll({
                where: {
                    [Op.and]: [
                        { nama: body.nama },
                        { idMenu: body.idMenu },

                    ]
                }
            })

            if (cek.length > 1 & parseInt(body.idMenu) === 0) {
                res.status(200).json({
                    berhasil: false,
                    'status': 'OK',
                    'messages': 'Nama menu sudah ada pada folder root',
                    'data': [],
                })
            } else if (cekIdMenu.length > 1 & parseInt(body.idMenu) !== 0) {
                res.status(200).json({
                    berhasil: false,
                    'status': 'OK',
                    'messages': 'Nama menu ' + body.nama + ' sudah ada di anak menu ini',
                    'data': [],
                })
            } else {

                await model.menu.update({
                    nama: body.nama,
                    idMenu: body.idMenu,
                    fungsi: body.fungsi,
                    icon: body.icon,
                    keterangan: body.keterangan,
                    statusMenu: body.statusMenu
                }, {
                    where: {
                        id: body.id
                    }
                });
                res.status(200).json({
                    berhasil: true,
                    'status': 'OK',
                    'messages': 'Menu berhasil ditambahkan',

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
    getMenuById: async (req, res, next) => {
        const id = req.params.id;
        try {
            const menu = await model.menu.findByPk(id);
            if (menu.length !== 0) {
                res.json({
                    'status': 'OK',
                    berhasil: true,
                    'messages': '',
                    'data': menu
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

    getMenu: async (req, res, next) => {
        const body = req.body;

        try {
            const menu = await model.menu.findAndCountAll({
                where: {
                    nama: {
                        [Op.like]: `%${body.cari}%`
                    }
                },
                offset: parseInt(body.page), limit: parseInt(body.size), order: [
                    [body.sortField, body.sortOrder],
                ]
            });

            const menuInduk = await model.menu.findAll({
                where: {
                    idMenu: 0,

                }
            })


            if (menu.length !== 0) {
                res.json({
                    'status': 'OK',
                    berhasil: true,
                    totalPage: menu.count,
                    limit: body.size,
                    page: body.page,
                    menuInduk: menuInduk,
                    'data': menu,

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

    getMenuAll: async (req, res, next) => {

        try {
            const menu = await model.menu.findAll({
                where: {
                    idMenu: 0,

                }
            });

            const menuSub = await model.menu.findAll({
                where: {
                    idMenu: {
                        [Op.ne]: 0
                    },

                }
            });

            const dataMenu = [];
            for (let i = 0; i < menu.length; i++) {
                dataMenu[i] = {
                    id: menu[i].id,
                    nama: menu[i].nama,
                    keterangan: menu[i].keterangan,
                    anak: []
                }
                for (let j = 0; j < menuSub.length; j++) {
                    if (menu[i].id === menuSub[j].idMenu) {
                        dataMenu[i]['anak'].push(
                            menuSub[j]
                        )
                    }
                }
            }



            if (menu.length !== 0) {
                res.json({
                    'status': 'OK',
                    berhasil: true,
                    data: dataMenu,
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

    deleteMenu: async (req, res, next) => {
        try {
            const menuId = req.params.id;
            const menu = await model.menu.destroy({
                where: {
                    id: menuId
                }
            })
            if (menu) {
                res.json({
                    'status': 'OK',
                    'messages': 'Menu berhasil dihapus',
                    'data': menu,
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
    aktifMenu: async (req, res, next) => {
        try {

            const menuId = req.params.id;
            const menu = await model.menu.update({ status: 1 }, {
                where: {
                    id: menuId
                }
            })
            if (menu) {
                res.json({
                    'status': 'OK',
                    'messages': 'Menu berhasil di aktifkan',
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
    nonAktifMenu: async (req, res, next) => {
        try {

            const menuId = req.params.id;
            const menu = await model.menu.update({ status: 0 }, {
                where: {
                    id: menuId
                }
            })
            if (menu) {
                res.json({
                    'status': 'OK',
                    'messages': 'Menu berhasil di non aktifkan',
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
    aktifMenuBanyak: async (req, res, next) => {
        try {

            const body = req.body;
            const menu = await model.menu.update({ status: 1 }, {
                where: {
                    id: body.id
                }
            })
            if (menu) {
                res.json({
                    'status': 'OK',
                    'messages': 'Menu berhasil di aktifkan',
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
    nonAktifMenuBanyak: async (req, res, next) => {
        try {

            const body = req.body;
            const menu = await model.menu.update({ status: 0 }, {
                where: {
                    id: body.id
                }
            })
            if (menu) {
                res.json({
                    'status': 'OK',
                    'messages': 'Menu berhasil di non aktifkan',
                })
            }
        } catch (err) {
            res.status(400).json({
                'status': 'ERROR',
                'messages': err.message,
                'data': {},
            })
        }
    }
}