const express = require('express')
const Router = express.Router()

const { addressController } = require('../controller')


Router.post('/addAddress', addressController.addAddress)
Router.get('/getAddress', addressController.getAddress)
Router.patch('/ defaultAddress', addressController.defaultAddress)
Router.delete('/deleteAddress', addressController.deleteAddress)


Router.get('/getProvince', addressController.getProvince)
Router.get('/getCity', addressController.getCity)



module.exports = Router
