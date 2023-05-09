"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, { foreignKey: "user_id" });
      this.hasMany(models.order, {
        foreignKey: "user_address_id",
      });
    }
  }
  user_address.init(
    {
      main_address: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      street_address: DataTypes.STRING,
      subdistrict: DataTypes.STRING,
      city: DataTypes.STRING,
      province: DataTypes.STRING,
      recipient_name: DataTypes.STRING,
      recipient_phone: DataTypes.INTEGER,
      postal_code: DataTypes.INTEGER,
      lat: DataTypes.DOUBLE,
      lng: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "user_address",
    }
  );
  return user_address;
};
