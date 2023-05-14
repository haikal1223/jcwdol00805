const express = require('express')
const Router = express.Router()

//Import All Controller
const { adminOrderController } = require('../controller')

Router.get('/view/:wh_id', adminOrderController.viewOrder)
Router.get('/order-detail/:id', adminOrderController.orderDetail)
Router.patch('/cancel-order/:id', adminOrderController.cancelOrder)
Router.patch('/confirm-order/:id', adminOrderController.confirmOrder)
Router.patch('/reject-order/:id', adminOrderController.rejectOrder)


module.exports = Router