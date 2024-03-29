const express = require('express')
const Router = express.Router()

const { addressController } = require('../controller')
const { tokenVerify } = require("../middleware/verifyToken");


Router.post('/addAddress', tokenVerify, addressController.addAddress)
Router.get('/getAddress', addressController.getAddress)
Router.patch('/defaultAddress', addressController.defaultAddress)
Router.delete('/deleteAddress/:id', addressController.deleteAddress)


Router.get('/getProvince', addressController.getProvince)
Router.get('/getCity', addressController.getCity)

Router.get('/open-cage', addressController.openCage)



module.exports = Router
