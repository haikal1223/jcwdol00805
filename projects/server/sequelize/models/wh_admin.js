'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class wh_admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.warehouse, {
        foreignKey: 'warehouse_id'
      })
      this.belongsTo(models.user, {
        foreignKey: 'user_id'
      })
    }
  }
  wh_admin.init({
    
  }, {
    sequelize,
    modelName: 'wh_admin',
    freezeTableName: true
  });
  return wh_admin;
};