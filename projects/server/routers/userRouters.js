const express = require("express");
const { userController } = require("../controllers");
const routers = express.Router();

routers.get("/verification", userController.getData);
routers.post("/register", userController.addData)
routers.patch("/verification/:uid", userController.inputPassword)

module.exports = routers
