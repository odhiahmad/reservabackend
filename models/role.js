'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class role extends Model {
        static associate(models) {
            role.hasMany(models.fungsi, { sourceKey: 'id', foreignKey: { name: 'idRole' }, as: 'roleFungsi' })
        }
    };
    role.init({
        nama: DataTypes.STRING,
        keterangan: DataTypes.STRING,
        status: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'role',
        tableName: 'role'
    });
    return role;
};