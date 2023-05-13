const express = require("express");
const Router = express.Router();

//Import All Controller
const { cartController } = require("../controller");
const { tokenVerify } = require("../middleware/verifyToken");

//Import JWTVerify

Router.get("/getstockorigin", tokenVerify, cartController.getStockOrigin);
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
Router.post("/postToOrder", tokenVerify, cartController.sendDataToOrder);
Router.get("/getUserCartx", tokenVerify, cartController.getUserCartx);
Router.delete("/delCart", cartController.delCart);
Router.patch("/updateNumberCart", cartController.updateNumberProduct);
// Router.get("/getStockOrigin", tokenVerify, cartController.getStockOrigin);
Router.get("/checkout", /* tokenVerify, */ cartController.getCheckoutCart);

module.exports = Router;
