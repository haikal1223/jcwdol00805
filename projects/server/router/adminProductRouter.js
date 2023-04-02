const express = require('express')
const Router = express.Router()

//Import All Controller
const { adminProductController } = require('../controller')

Router.get('/fetch/:id', adminProductController.fetchDetail)
Router.get('/edit-stock/:id', adminProductController.editStock)


module.exports = Router