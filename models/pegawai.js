'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class pegawai extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //   absen.hasOne(models.users, { sourceKey: 'id_user', foreignKey: { name: 'id' }, as: 'user' })

        }
    };

    pegawai.init({
        id_user: DataTypes.INTEGER,
        nama: DataTypes.STRING,
        tipe: DataTypes.STRING,
        gaji: DataTypes.INTEGER,



    }, {
        sequelize,
        modelName: 'pegawai',
        tableName: 'pegawai'
    });
    return pegawai;
};