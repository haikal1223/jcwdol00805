const express = require("express");
const Router = express.Router();

//Import All Controller
const { adminController } = require("../controller");
const { tokenVerify } = require("../middleware/verifyToken");

Router.delete("/delete/:id", adminController.deleteWHAdmin);
Router.get("/login", adminController.login);
Router.post(
  "/assign-wh-admin",
  tokenVerify,
  adminController.assignWarehouseAdmin
);
Router.get("/data-user", tokenVerify, adminController.showAllUserData);

module.exports = Router;
