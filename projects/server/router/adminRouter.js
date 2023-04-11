const express = require("express");
const Router = express.Router();

//Import All Controller
const { adminController } = require("../controller");
const { tokenVerify } = require("../middleware/verifyToken");

Router.get("/login", adminController.login);
Router.get("/product-category", adminController.showProductCategory);
Router.post(
  "/product-category",
  tokenVerify,
  adminController.addProductCategory
);
Router.put(
  "/product-category/:id",
  tokenVerify,
  adminController.editProductCategory
);
Router.delete(
  "/product-category/:id",
  tokenVerify,
  adminController.deleteProductCategory
);
module.exports = Router;
