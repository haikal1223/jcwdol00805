const express = require("express");
const Router = express.Router();

//Import All Controller
const { cartController } = require("../controller");
const { tokenVerify } = require("../middleware/verifyToken");

//Import JWTVerify


Router.get("/getCartFilterProduct", cartController.getCartFilterProduct);
Router.post("/addCart", cartController.addCartProduct);
Router.patch("/updateCart", cartController.updateCartProduct);
Router.get("/getUserCart", cartController.getUserCart);
Router.post("/new-address/", tokenVerify, cartController.addAddress);
Router.patch("/main-address/:id", tokenVerify, cartController.defaultAddress);
Router.get("/rajaongkir-province", cartController.getProvince);
Router.get("/rajaongkir-city", cartController.getCity);
Router.get("/get-address", tokenVerify, cartController.getAddress);
Router.delete("/delete-address/:id", tokenVerify, cartController.deleteAddress);


module.exports = Router;
