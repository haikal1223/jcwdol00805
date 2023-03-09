'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    birth_date: DataTypes.DATE,
    birth_place: DataTypes.STRING,
    is_verified: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};