const express = require('express')
const Router = express.Router()

//Import All Controller
const { userController } = require('../controller')

//Import JWTVerify

Router.post('/register', userController.registerUser);
Router.get("/verification", userController.getData);
Router.patch("/verification/:uid", userController.inputPassword)
// Router.post('/forgot-password', userController.forgotPassword)
// Router.patch('/reset-password/:uid', userController.resetPassword)
Router.get('/login', userController.login)
Router.get('/verifytoken', userController.verifytoken)


module.exports = Router
