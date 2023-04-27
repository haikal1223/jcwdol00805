"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stock_mutation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.mutation_status, {
        foreignKey: "mutation_status_id",
      });
      this.belongsTo(models.user, {
        foreignKey: "user_id",
      });
      this.belongsTo(models.order, {
        foreignKey: "order_id",
      });
      this.belongsTo(models.product, {
        foreignKey: "product_id",
      });
      this.hasMany(models.stock_log, {
        foreignKey: "mutation_id",
      });
    }
  }
  stock_mutation.init(
    {
      origin_wh_id: DataTypes.INTEGER,
      target_wh_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "stock_mutation",
      freezeTableName: true,
    }
  );
  return stock_mutation;
};
