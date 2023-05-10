"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.product_category, {
        foreignKey: "product_category_id",
      });
      this.hasMany(models.order_detail,{
        foreignKey: 'product_id'
      })

      this.hasMany(models.order_detail,{
        foreignKey: 'product_id'
      })

      this.hasMany(models.cart, {
        foreignKey: "product_id",
      });

      this.hasMany(models.product_stock, {
        foreignKey: "product_id",
      });

      this.hasMany(models.stock_mutation, {
        foreignKey: 'product_id'
      })
      this.hasMany(models.stock_log, {
        foreignKey: 'product_id'
      })
      this.hasMany(models.stock_mutation, {
        foreignKey: 'product_id'
      })
      this.hasMany(models.stock_log, {
        foreignKey: 'product_id'
      })
    }
  }
  product.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      product_category_id: DataTypes.INTEGER,
      image_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "product",
      freezeTableName: true,
    }
  );
  return product;
};
