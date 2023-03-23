'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.product, {
        foreignKey: 'product_id'
      })

      this.belongsTo(models.warehouse, {
        foreignKey: 'warehouse_id'
      })
    }
  }
  product_stock.init({
    stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'product_stock',
    freezeTableName: true
  });
  return product_stock;
};