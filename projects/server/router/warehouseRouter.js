const express = require("express");
const Router = express.Router();

const { warehouseController } = require("../controller");

Router.post("/add-warehouse", warehouseController.addWarehouseData);
Router.get("/all-warehouse", warehouseController.findAllWarehouseData);
Router.get("/findOne-warehouse", warehouseController.findOneWarehouseData);
Router.put("/update-warehouse/:id", warehouseController.editWarehouseData);
Router.delete("/delete-warehouse/:id", warehouseController.removeWarehouseData);

module.exports = Router;
