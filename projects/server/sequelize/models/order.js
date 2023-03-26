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
      this.belongsTo(models.order_status, {
        foreignKey: 'order_status_id'
      })
      this.belongsTo(models.user, {
        foreignKey: 'user_uid'
      })
      this.belongsTo(models.warehouse, {
        foreignKey: 'warehouse_id'
      })
      this.hasMany(models.order_detail,{
        foreignKey: 'order_id'
      })
    }
  }
  order.init({
    paid_amount: DataTypes.INTEGER,
    user_address_id: DataTypes.INTEGER,
    payment_proof: DataTypes.STRING,
    shipping_cost: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'order',
    freezeTableName: true
  });
  return order;
};