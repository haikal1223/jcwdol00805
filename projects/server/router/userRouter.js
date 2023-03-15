const express = require('express')
const Router = express.Router()


const { userController } = require('../controller')


Router.get('/login', userController.login)
module.exports = Router;