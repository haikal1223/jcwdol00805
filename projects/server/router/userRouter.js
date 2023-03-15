const express = require("express");
const Router = express.Router();

const { userController } = require("../controller");

Router.get("/verification", userController.getData);
Router.patch("/verification/:uid", userController.inputPassword)

module.exports = Router
