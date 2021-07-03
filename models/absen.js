'use strict';
const {
  Model
} = require('sequelize');
const users = require('./users');
module.exports = (sequelize, DataTypes) => {
  class absen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      absen.hasOne(models.users, { sourceKey: 'id_user', foreignKey: { name: 'id' }, as: 'user' })

    }
  };

  absen.init({
    id_user: DataTypes.INTEGER,
    id_pegawai: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    tanggal: DataTypes.DATE,
    jam_masuk: DataTypes.TIME,
    jam_keluar: DataTypes.TIME,
    terlambat: DataTypes.INTEGER,
    total: DataTypes.TIME,
    status: DataTypes.INTEGER


  }, {
    sequelize,
    modelName: 'absen',
    tableName: 'absen'
  });
  return absen;
};