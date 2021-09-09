'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class menu extends Model {
        static associate(models) {

        }
    };
    menu.init({
        idMenu: DataTypes.INTEGER,
        nama: DataTypes.STRING,
        icon: DataTypes.STRING,
        keterangan: DataTypes.STRING,
        status: DataTypes.INTEGER,
        statusMenu: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'menu',
        tableName: 'menu'
    });
    return menu;
};