const express = require('express')
const Router = express.Router()

//Import All Controller
const { adminOrderController } = require('../controller')

Router.get('/view/:wh_id', adminOrderController.viewOrder)


module.exports = Router