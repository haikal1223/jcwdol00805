
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class order_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.belongsTo(models.order, {
        foreignKey: "order_id",
      });
      this.belongsTo(models.product, {
        foreignKey: "product_id",
      });
    }
  }
  order_detail.init(
    {
      product_price: DataTypes.INTEGER,
      product_quantity: DataTypes.INTEGER,
      subtotal: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "order_detail",
      freezeTableName: true,
    }
  );
  return order_detail;
};


