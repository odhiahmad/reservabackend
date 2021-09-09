'use strict';
const { genSaltSync, hashSync, compareSync } = require("bcrypt");

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('role', [
            {
                nama: 'superadmin',
                keterangan: 'Role Super Admin',
                status: '1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama: 'admin',
                keterangan: 'Role Admin',
                status: '1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama: 'user',
                keterangan: 'Role User',
                status: '1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('role', null, {});
    }
};
