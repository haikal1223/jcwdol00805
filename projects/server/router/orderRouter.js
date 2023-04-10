const express = require("express");
const Router = express.Router();

const { orderController } = require("../controller");
const { tokenVerify } = require("../middleware/verifyToken");

Router.get("/getOrderCart", tokenVerify, orderController.getCart);
Router.delete("/cancel", tokenVerify, orderController.cancel);

module.exports = Router;
