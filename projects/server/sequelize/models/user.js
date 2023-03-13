'use strict';
const { UUIDV4 } = require("sequelize");
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
    uid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.INTEGER,
    role: DataTypes.STRING,
    birth_date: DataTypes.INTEGER,
    birth_place: DataTypes.STRING,
    is_verified: DataTypes.INTEGER,
    is_Updated: DataTypes.INTEGER,
    password: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};