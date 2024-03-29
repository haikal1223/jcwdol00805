"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey: "user_id",
      });


      this.belongsTo(models.product, {
        foreignKey: "product_id",
      });
    }
  }
  cart.init(
    {
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      is_checked: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "cart",
    }
  );
  return cart;
};
