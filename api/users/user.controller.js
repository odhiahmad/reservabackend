const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const model = require('../../models/index');

module.exports = {
  createUser: async (req, res, next) => {
    try {
      const {
        username,
        password,
        role,
      } = req.body;

      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);
      const users = await model.users.create({
        username: username,
        password: password,
        role: role,
      });
      if (users) {
        res.status(200).json({
          'status': 'OK',
          'messages': 'User berhasil ditambahkan',
          'data': users,
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
  getUserById: async (req, res, next) => {
    const id = req.params.id;
    try {
      const users = await model.users.findByPk(id);
      if (users.length !== 0) {
        res.json({
          'status': 'OK',
          berhasil: true,
          'messages': '',
          'data': users
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
  getUserAbsenById: async (req, res, next) => {
    const id = req.params.id;
    try {
      const users = await model.users.findByPk(id, { include: ['absen'] });
      if (users.length !== 0) {
        res.json({
          'status': 'OK',
          berhasil: true,
          'messages': '',
          'data': users
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

  getUser: async (req, res, next) => {
    const body = req.body;

    try {
      const users = await model.users.findAndCountAll({
        // where: { role: 'Admin' },
        offset: parseInt(body.page), limit: parseInt(body.size), include: ['pegawai'], order: [
          [body.sortField, body.sortOrder],
        ]
      });
      if (users.length !== 0) {
        res.json({
          'status': 'OK',
          berhasil: true,
          totalPage: users.count,
          limit: body.size,
          page: body.page,
          'data': users,

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


  deleteUser: async (req, res, next) => {
    try {
      const usersId = req.params.id;
      const users = await model.users.destroy({
        where: {
          id: usersId
        }
      })
      if (users) {
        res.json({
          'status': 'OK',
          'messages': 'User berhasil dihapus',
          'data': users,
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
  login: async (req, res, next) => {
    const body = req.body;
    try {
      const results = await model.users.findOne({
        where: {
          username: body.username
        }
      });
      if (results.length !== 0) {
        const result = compareSync(body.password, results.password);
        if (result) {
          body.id = results.id;
          if (results.device_id === null) {
            await model.users.update({
              device_id: body.device_id,
              device_name: body.device_name,
              device_device: body.device_device,
              device_hardware: body.device_hardware
            }, {
              where: {
                id: body.id
              }
            });
          }
          results.password = undefined;
          const jsonToken = sign({ result: results }, "qwe1234", { expiresIn: "7d" });
          return res.json({
            berhasil: true,
            pesan: 'Login Berhasil',
            data: results,
            token: jsonToken,
          });
        } else {
          return res.json({
            berhasil: false,
            data: 'Email atau Password salah'
          })
        }
      } else {
        return res.json({
          berhasil: false,
          data: "Username atau password salah"
        });
      }
    }
    catch (err) {
      res.json({
        berhasil: false,
        'status': 'ERROR',
        'messages': err.message,
        'data': {}
      })
    }

  }
}