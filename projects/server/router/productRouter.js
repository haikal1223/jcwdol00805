const express = require('express')
const Router = express.Router()

// import controller
const { productController } = require('../controller')

// import middleware
/* const decodeToken = require('./../middleware/decodeToken')
const uploadImages = require('../middleware/upload') */

// Router method
Router.get('/view', productController.viewProduct)
Router.get('/detail/:id', productController.viewDetailProduct)

module.exports = Router