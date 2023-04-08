const express = require('express')
const Router = express.Router()

//Import All Controller
const { adminProductController } = require('../controller')

Router.get('/fetch/:id', adminProductController.fetchDetail)
Router.patch('/edit-stock/:id', adminProductController.editStock)
Router.get('/fetch-warehouse/:id', adminProductController.fetchWarehouse)
Router.post('/add-stock/:id', adminProductController.addStock)
Router.delete('/delete-stock/:id', adminProductController.deleteStock)


module.exports = Router