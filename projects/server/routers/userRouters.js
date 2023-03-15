const express = require("express");
const { userController } = require("../controllers");
const routers = express.Router();
const uploadImages = require("./../middleware/upload");

routers.get("/verification", userController.getData);
routers.post("/register", userController.addData);
routers.patch("/verification/:uid", userController.inputPassword);
routers.patch("/uploadphoto/:uid", uploadImages, userController.uploadPhoto);
routers.get('/getphoto', userController.getProfilePhoto)
routers.patch('/updateprofile/:uid', userController.updateProfile)
routers.patch('/updatepassword', userController.updatePassword)

module.exports = routers;
