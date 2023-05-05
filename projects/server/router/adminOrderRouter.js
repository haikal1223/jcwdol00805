const express = require('express')
const Router = express.Router()

//Import All Controller
const { adminOrderController } = require('../controller')

Router.get('/view/:wh_id', adminOrderController.viewOrder)
Router.get('/order-detail/:id', adminOrderController.orderDetail)
Router.get('/cancel-order/:id', adminOrderController.cancelOrder)


module.exports = Router