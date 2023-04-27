const express = require("express");
const Router = express.Router();

// Import All Controller
const { adminController } = require("../controller");
const { tokenVerify } = require("../middleware/verifyToken");

Router.put("/orders/:orderId", tokenVerify, adminController.updateOrderStatus);
Router.put(
  "/orders/:orderId/delivered",
  tokenVerify,
  adminController.updateUserOrderStatus
);
Router.get("/login", adminController.login);
Router.get("/orders", adminController.showOrderData);
Router.get(
  "/productStockByWarehouse",
  tokenVerify,
  adminController.productStockByWarehouse
);
Router.get("/warehouses", tokenVerify, adminController.fetchWarehouse);
Router.get(
  "/sum-report",
  tokenVerify,
  adminController.summaryAllProductMonthly
);

Router.get("/detail-report", tokenVerify, adminController.fetchStockLog);
Router.get("/products", adminController.fetchProduct);

module.exports = Router;
