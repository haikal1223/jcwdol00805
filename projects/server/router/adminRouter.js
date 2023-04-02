const express = require('express')
const Router = express.Router()

//Import All Controller
const { adminController } = require('../controller')

Router.get('/login', adminController.login)


module.exports = Router