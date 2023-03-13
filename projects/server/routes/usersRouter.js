const express = require('express')
const Router = express.Router()


const { usersController } = require('../controller')

Router.post('/register', usersController.registerUser)
Router.get('/login', usersController.login)
module.exports = Router;