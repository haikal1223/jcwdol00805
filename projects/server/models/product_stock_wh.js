'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_stock_wh extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product_stock_wh.init({
    stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'product_stock_wh',
  });
  return product_stock_wh;
};