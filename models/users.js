'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      users.hasMany(models.absen, { foreignKey: 'id_user', as: 'absen' })
      users.hasOne(models.pegawai, { foreignKey: 'id_user', as: 'pegawai' })
    }
  };
  users.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    device_id: DataTypes.STRING,
    device_name: DataTypes.STRING,
    device_device: DataTypes.STRING,
    device_hardware: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};