const express = require('express')
const Router = express.Router()

//Import All Controller
const { adminMutationController } = require('../controller')

Router.get('/view/', adminMutationController.viewMutation)


module.exports = Router