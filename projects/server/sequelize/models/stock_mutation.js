'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stock_mutation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  stock_mutation.init({
    role: DataTypes.STRING,
    old_stock: DataTypes.INTEGER,
    new_stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'stock_mutation',
  });
  return stock_mutation;
};