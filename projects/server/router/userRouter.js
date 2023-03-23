const express = require('express')
const Router = express.Router()

//Import All Controller
const { userController } = require('../controller')

//Import JWTVerify
//Import multer
const uploadImages = require("../middleware/upload");
const { multerUpload } = require("./../lib/multer");


Router.post('/register', userController.registerUser);
Router.get("/verification", userController.getData);
Router.patch("/verification/:uid", userController.inputPassword)
Router.patch(
  "/uploadphoto",
  multerUpload.fields([{ name: "images", maxCount: 1 }]),
  userController.uploadPhoto
);
Router.get("/getphoto", userController.getProfilePhoto);
Router.patch("/updateprofile/:uid", userController.updateProfile);
Router.patch("/updatepassword", userController.updatePassword);
Router.patch("/verifytoken", userController.verifyToken);
// Router.post('/forgot-password', userController.forgotPassword)
// Router.patch('/reset-password/:uid', userController.resetPassword)
Router.get('/login', userController.login)

module.exports = Router