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

module.exports = Router;
