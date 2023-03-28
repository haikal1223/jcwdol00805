const express = require('express')
const Router = express.Router()

//Import All Controller
const { adminController } = require('../controller')

Router.get('/login', adminController.login)
Router.get('/adminData', adminController.adminData)
Router.get('/userData', adminController.userData)


module.exports = Router