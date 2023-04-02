"use strict";
const { UUIDV4, Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      this.hasMany(models.wh_admin, {
        foreignKey: 'user_uid'
      })
      this.hasMany(models.order, {
        foreignKey: 'user_uid'
      })
      this.hasMany(models.cart, {
        foreignKey: 'user_uid'
      })
      this.hasMany(models.stock_mutation, {
        foreignKey: 'user_uid'
      })
      this.hasMany(models.stock_log, {
        foreignKey: 'user_uid'
      })
    }
  }
  user.init(
    {
      uid: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
      },
      first_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      last_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      is_verified: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      gender: DataTypes.INTEGER,
      birth_date: DataTypes.DATEONLY,
      birth_place: DataTypes.STRING,
      profile_photo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
