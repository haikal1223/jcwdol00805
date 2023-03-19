const express = require("express");
const { userController } = require("../controller");
const Router = express.Router();
const uploadImages = require("../middleware/upload");
const { multerUpload } = require("./../lib/multer");

Router.get("/verification", userController.getData);
Router.post("/register", userController.addData);
Router.patch("/verification/:uid", userController.inputPassword);
Router.patch(
  "/uploadphoto",
  multerUpload.fields([{ name: "images", maxCount: 1 }]),
  userController.uploadPhoto
);
Router.get("/getphoto", userController.getProfilePhoto);
Router.patch("/updateprofile/:uid", userController.updateProfile);
Router.patch("/updatepassword", userController.updatePassword);

module.exports = Router;
