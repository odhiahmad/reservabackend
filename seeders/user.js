'use strict';
const { genSaltSync, hashSync, compareSync } = require("bcrypt");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user', [
      {
        email: 'odhi',
        nama: 'Odhi Ahmad',
        password: hashSync('admin123', genSaltSync(10)),
        role: '1',
        status: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'rudi',
        nama: 'Rudi Maliq',
        password: hashSync('admin123', genSaltSync(10)),
        role: '1',
        status: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'rani',
        nama: 'Rani Masyithah',
        password: hashSync('admin123', genSaltSync(10)),
        role: '1',
        status: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user', null, {});
  }
};
