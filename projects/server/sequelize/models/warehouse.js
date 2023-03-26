'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class warehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.product_stock, {
        foreignKey: 'warehouse_id'
      })
      this.hasMany(models.wh_admin, {
        foreignKey: 'warehouse_id'
      })
      this.hasMany(models.order, {
        foreignKey: 'warehouse_id'
      })
    }
  }
  warehouse.init({
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    lng: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'warehouse',
    freezeTableName: true
  });
  return warehouse;
};