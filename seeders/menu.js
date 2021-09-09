'use strict';
const { genSaltSync, hashSync, compareSync } = require("bcrypt");

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('menu', [
            {
                idMenu: 0,
                nama: 'home',
                icon: 'home',
                keterangan: 'Home',
                status: '1',
                statusMenu: '0',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                idMenu: 0,
                nama: 'user',
                icon: 'account',
                keterangan: 'User',
                status: '1',
                statusMenu: '0',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                idMenu: 0,
                nama: 'role',
                icon: 'settings',
                keterangan: 'Role',
                status: '1',
                statusMenu: '0',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                idMenu: 0,
                nama: 'menu',
                icon: 'menu',
                keterangan: 'Menu',
                status: '1',
                statusMenu: '0',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('menu', null, {});
    }
};
