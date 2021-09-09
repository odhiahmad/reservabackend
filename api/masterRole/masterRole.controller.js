const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const model = require('../../models/index');
const { Sequelize, Op, QueryTypes } = require("sequelize");
const menuData = require("../masterMenu/menuData");
const AccessControl = require("accesscontrol");
const moment = require('moment');
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
  createRole: async (req, res, next) => {
    try {
      const body = req.body.data;
      const cekNama = await model.role.findAll({
        where: {
          nama: body.nama
        }
      })

      if (cekNama > 0) {
        res.status(200).json({
          berhasil: false,
          'status': 'OK',
          'messages': 'Nama role sudah ada',
          'data': [],
        })
      } else {
        const role = await model.role.create({
          nama: body.nama,
          keterangan: body.keterangan,
          status: 1,
        });
        if (role) {
          const dataFungsi = [];
          var nomor = 0;
          for (let i = 0; i < body.idMenu.length; i++) {
            dataFungsi[nomor] = {
              idRole: role.id,
              idMenu: body.idMenu[i],
              keterangan: body.nama,
              fungsi: ['read', 'update', 'delete', 'create'],
              status: 1,
            }
            nomor++;
          }
          for (let i = 0; i < body.idMenu_sub.length; i++) {
            dataFungsi[nomor] = {
              idRole: role.id,
              idMenu: body.idMenu_sub[i],
              keterangan: body.nama,
              fungsi: ['read', 'update', 'delete', 'create'],
              status: 1,
            }
            nomor++;
          }
          await model.fungsi.bulkCreate(
            dataFungsi
          );

          res.status(200).json({
            berhasil: true,
            'status': 'OK',
            'messages': 'Role berhasil ditambahkan',
            'data': role,
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
  editRole: async (req, res, next) => {
    try {
      const body = req.body.data;
      const cekNama = await model.role.findAll({
        where: {
          nama: body.nama
        }
      })

      if (cekNama > 0) {
        res.status(200).json({
          berhasil: false,
          'status': 'OK',
          'messages': 'Nama role sudah ada',
          'data': [],
        })
      } else {
        const role = await model.role.update({
          nama: body.nama,
          idMenu: body.idMenu,
          idMenu_sub: body.idMenu_sub,
          keterangan: body.keterangan,
        }, {
          where: {
            id: body.id
          }
        });
        res.status(200).json({
          berhasil: true,
          'status': 'OK',
          'messages': 'Role berhasil ditambahkan',
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
  getRoleById: async (req, res, next) => {
    const id = req.params.id;
    try {
      const role = await model.role.findByPk(id);
      if (role.length !== 0) {
        res.json({
          'status': 'OK',
          berhasil: true,
          'messages': '',
          'data': role
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
  getRoleAll: async (req, res, next) => {
    const id = req.params.id;
    try {
      const role = await model.role.findAll(
        {
          attributes: ['id', 'nama', 'keterangan']
        }
      );
      if (role.length !== 0) {
        res.json({
          'status': 'OK',
          berhasil: true,
          'messages': '',
          'data': role
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
  getRole: async (req, res, next) => {
    const body = req.body;

    try {
      const role = await model.role.findAndCountAll({
        where: {
          nama: {
            [Op.like]: `%${body.cari}%`
          }
        },
        offset: parseInt(body.page), limit: parseInt(body.size), order: [
          [body.sortField, body.sortOrder],
        ],
        include: {
          model: model.fungsi,
          as: 'roleFungsi',
          include: {
            model: model.menu,
            as: 'userFungsi'
          }
        }

      });

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

      if (role.length !== 0) {
        res.json({
          'status': 'OK',
          berhasil: true,
          totalPage: role.count,
          limit: body.size,
          page: body.page,
          'data': role,
          menu: dataMenu,



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
  deleteRole: async (req, res, next) => {
    try {
      const roleId = req.params.id;
      const role = await model.role.destroy({
        where: {
          id: roleId
        }
      })
      if (role) {
        res.json({
          'status': 'OK',
          'messages': 'Role berhasil dihapus',
          'data': role,
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
  aktifRoleBanyak: async (req, res, next) => {
    try {

      const body = req.body;
      const role = await model.role.update({ status: 1 }, {
        where: {
          id: body.id
        }
      })
      if (role) {
        res.json({
          'status': 'OK',
          'messages': 'Role berhasil di aktifkan',
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
  nonAktifRoleBanyak: async (req, res, next) => {
    try {

      const body = req.body;
      const role = await model.role.update({ status: 0 }, {
        where: {
          id: body.id
        }
      })
      if (role) {
        res.json({
          'status': 'OK',
          'messages': 'Role berhasil di non aktifkan',
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