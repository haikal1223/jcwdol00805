const express = require('express')
const Router = express.Router()

//Import All Controller
const { userController } = require('../controller')

//Import JWTVerify

Router.post('/register', userController.registerUser)


module.exports = Router