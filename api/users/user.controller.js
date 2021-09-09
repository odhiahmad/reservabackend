const { genSaltSync, hashSync } = require("bcrypt");

const model = require('../../models/index');
const { Op } = require("sequelize");
const AccessControl = require("accesscontrol");

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

async function isDuplicate(email) {

  if (cekDuplicate === null) {
    return 0
  } else {
    return 1
  }
}

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



  createUser: async (req, res, next) => {
    try {
      const body = req.body.data;
      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);
      const user = await model.user.create({
        email: body.email,
        nama: body.nama,
        password: body.password,
        role: body.role,
        status: 1,
      });

      // const dataCreate = []
      // for (let i = 0; i < 400000; i++) {
      //   dataCreate.push({
      //     email: 'lala' + makeid(10) + 'omi' + makeid(10),
      //     nama: 'Halo Omi',
      //     password: body.password,
      //     role: body.role,
      //     status: 1,
      //   })
      // }

      // const create = await model.user.bulkCreate(dataCreate)

      res.status(200).json({
        status: 'OK',
        pesan: 'User berhasil ditambahkan',
        data: user,
      })

    } catch (err) {
      res.status(400).json({
        status: 'ERROR',
        pesan: err.message,
        data: {},
      })
    }
  },
  editUser: async (req, res, next) => {
    try {
      const body = req.body.data;
      const cekDuplicate = await model.user.findOne({ where: { email: body.email, id: { [Op.not]: body.id } } })
      console.log(cekDuplicate)
      if (cekDuplicate === null) {
        if (body.password === "") {
          const user = await model.user.update({
            email: body.email,
            nama: body.nama,
            role: body.role,
          }, {
            where: {
              id: body.id
            }
          });

          res.status(200).json({
            berhasil: true,
            status: 'OK',
            pesan: 'User berhasil ditambahkan',
            data: user
          })
        } else {
          const salt = genSaltSync(10);
          body.password = hashSync(body.password, salt);
          const user = await model.user.update({
            email: body.email,
            nama: body.nama,
            password: body.password,
            role: body.role,
          }, {
            where: {
              id: body.id
            }
          });

          res.status(200).json({
            berhasil: true,
            status: 'OK',
            pesan: 'User berhasil ditambahkan',
            data: user
          })
        }
      } else {
        res.status(200).json({
          berhasil: false,
          status: 'OK',
          pesan: 'Email yang ada inputkan sudah terdaftar',

        })
      }

    } catch (err) {
      res.status(400).json({
        status: 'ERROR',
        pesan: err.message,
        data: {},
      })
    }
  },
  getUserById: async (req, res, next) => {
    const id = req.params.id;
    try {
      const user = await model.user.findByPk(id);

      if (user.length !== 0) {
        res.json({
          status: 'OK',
          berhasil: true,
          pesan: '',
          data: user,
        })
      } else {
        res.json({
          status: 'ERROR',
          berhasil: true,
          pesan: 'EMPTY',
          data: {}
        })
      }
    } catch (err) {
      res.json({
        berhasil: false,
        status: 'ERROR',
        pesan: err.message,
        data: {}
      })
    }
  },
  getUser: async (req, res, next) => {
    const body = req.body;
    try {
      const user = await model.user.findAndCountAll({
        where: {
          email: {
            [Op.like]: `%${body.cari}%`
          }
        },
        offset: parseInt(body.page), limit: parseInt(body.size), include: ['roleUser'], order: [
          [body.sortField, body.sortOrder],
        ]
      });
      if (user.length !== 0) {
        res.json({
          status: 'OK',
          berhasil: true,
          totalPage: user.count,
          limit: body.size,
          page: body.page,
          data: user,
        })
      } else {
        res.json({
          status: 'ERROR',
          berhasil: true,
          pesan: 'EMPTY',
          data: {}
        })
      }
    } catch (err) {
      res.json({
        berhasil: false,
        status: 'ERROR',
        pesan: err.message,
        data: {}
      })
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const user = await model.user.destroy({
        where: {
          id: userId
        }
      })
      if (user) {
        res.json({
          status: 'OK',
          pesan: 'User berhasil dihapus',
          data: user,
        })
      }
    } catch (err) {
      res.status(400).json({
        status: 'ERROR',
        pesan: err.message,
        data: {},
      })
    }
  },
  aktifUserBanyak: async (req, res, next) => {
    try {

      const body = req.body;
      const user = await model.user.update({ status: 1 }, {
        where: {
          id: body.id
        }
      })
      if (user) {
        res.json({
          status: 'OK',
          pesan: 'User berhasil di aktifkan',
        })
      }
    } catch (err) {
      res.status(400).json({
        status: 'ERROR',
        pesan: err.message,
        data: {},
      })
    }
  },
  nonAktifUserBanyak: async (req, res, next) => {
    try {

      const body = req.body;
      const user = await model.user.update({ status: 0 }, {
        where: {
          id: body.id
        }
      })
      if (user) {
        res.json({
          status: 'OK',
          pesan: 'User berhasil di non aktifkan',
        })
      }
    } catch (err) {
      res.status(400).json({
        status: 'ERROR',
        pesan: err.message,
        data: {},
      })
    }
  },
}




