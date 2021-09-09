'use strict';
const { genSaltSync, hashSync, compareSync } = require("bcrypt");

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('fungsi', [
            {
                idMenu: 1,
                idRole: 1,
                fungsi: ['create', 'update', 'delete', 'read'],
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                idMenu: 2,
                idRole: 1,
                fungsi: ['create', 'update', 'delete', 'read'],
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                idMenu: 3,
                idRole: 1,
                fungsi: ['create', 'update', 'delete', 'read'],
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                idMenu: 4,
                idRole: 1,
                fungsi: ['create', 'update', 'delete', 'read'],
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                idMenu: 1,
                idRole: 2,
                fungsi: ['create', 'update', 'delete', 'read'],
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                idMenu: 2,
                idRole: 2,
                fungsi: ['create', 'update', 'delete', 'read'],
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                idMenu: 3,
                idRole: 2,
                fungsi: ['create', 'update', 'delete', 'read'],
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                idMenu: 4,
                idRole: 2,
                fungsi: ['create', 'update', 'delete', 'read'],
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                idMenu: 1,
                idRole: 3,
                fungsi: ['create', 'update', 'delete', 'read'],
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                idMenu: 2,
                idRole: 3,
                fungsi: ['create', 'update', 'delete', 'read'],
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                idMenu: 3,
                idRole: 3,
                fungsi: ['create', 'update', 'delete', 'read'],
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                idMenu: 4,
                idRole: 3,
                fungsi: ['create', 'update', 'delete', 'read'],
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },

        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('fungsi', null, {});
    }
};
