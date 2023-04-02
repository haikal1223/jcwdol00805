const express = require("express");
const Router = express.Router();

// import controller
const { productController } = require("../controller");

// import middleware
/* const decodeToken = require('./../middleware/decodeToken')
const uploadImages = require('../middleware/upload') */

// Router method
Router.get("/view", productController.viewProduct);
Router.get("/productData", productController.viewProductData);
Router.get("/detail", productController.viewDetailProduct);
Router.get("/productStock", productController.viewProductStock);

module.exports = Router;
