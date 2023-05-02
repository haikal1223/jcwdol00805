'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stock_log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey: 'user_id'
      })
      this.belongsTo(models.order, {
        foreignKey: 'order_id'
      })
      this.belongsTo(models.product, {
        foreignKey: 'product_id'
      })
      this.belongsTo(models.warehouse, {
        foreignKey: 'warehouse_id'
      })
      this.belongsTo(models.stock_mutation, {
        foreignKey: 'mutation_id'
      })
    }
  }
  stock_log.init({
    mutation_id: DataTypes.INTEGER,
    old_stock: DataTypes.INTEGER,
    new_stock: DataTypes.INTEGER,
    operation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'stock_log',
    freezeTableName: true
  });
  return stock_log;
};