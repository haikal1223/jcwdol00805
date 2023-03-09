'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  order.init({
    paid_amount: DataTypes.INTEGER,
    payment_proof: DataTypes.STRING,
    shipping_cost: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};