const express = require("express");
const Router = express.Router();

//Import All Controller
const { adminController } = require("../controller");

Router.get("/login", adminController.login);
Router.get("/verify-token", adminController.verifyToken);
Router.get("/fetch-warehouse", adminController.fetchWarehouse);

module.exports = Router;
