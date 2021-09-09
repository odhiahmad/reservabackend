'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class fungsi extends Model {
        static associate(models) {
            fungsi.hasOne(models.menu, { sourceKey: 'idMenu', foreignKey: { name: 'id' }, as: 'userFungsi' })
        }
    };

    fungsi.init({
        idMenu: DataTypes.INTEGER,
        idRole: DataTypes.INTEGER,
        fungsi: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                return this.getDataValue('fungsi').split(',')
            },
            set(val) {
                this.setDataValue('fungsi', val.join(','));
            },
        },
        status: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'fungsi',
        tableName: 'fungsi'
    });
    return fungsi;
};