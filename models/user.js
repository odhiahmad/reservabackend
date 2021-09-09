'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {

      user.hasOne(models.role, { sourceKey: 'role', foreignKey: { name: 'id' }, as: 'roleUser' })
    }
  };
  user.init({
    email: DataTypes.STRING,
    nama: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.INTEGER,
    status: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'user',
    tableName: 'user'

  });
  return user;
};