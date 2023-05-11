const express = require("express");
const Router = express.Router();

const { orderController } = require("../controller");
const { tokenVerify } = require("../middleware/verifyToken");

Router.get("/getOrderCart", tokenVerify, orderController.getCart);
Router.get("/getOrderList", tokenVerify, orderController.getOrderList);
Router.patch("/cancel", orderController.cancel);
Router.get("/getOrder", tokenVerify, orderController.getOrder);
Router.post("/create-order", orderController.createOrder);

module.exports = Router;

