const express = require('express')
const Router = express.Router()

//Import All Controller
const { cartController } = require('../controller')

//Import JWTVerify

Router.get('/getCartFilterProduct', cartController.getCartFilterProduct);
Router.post('/addCart', cartController.addCartProduct);
Router.patch('/updateCart', cartController.updateCartProduct);
Router.get('/getUserCart', cartController.getUserCart);
Router.delete('/delCart', cartController.delCart);
Router.patch('/updateNumberCart', cartController.updateNumberProduct);

module.exports = Router
