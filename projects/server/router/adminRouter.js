const express = require("express");
const Router = express.Router();

//Import All Controller
const { adminController } = require("../controller");
const { tokenVerify } = require("../middleware/verifyToken");

Router.delete("/delete/:id", adminController.deleteWHAdmin);
Router.post(
  "/assign-wh-admin",
  tokenVerify,
  adminController.assignWarehouseAdmin
);
Router.get("/data-user", tokenVerify, adminController.showAllUserData);
Router.get("/login", adminController.login);

Router.get("/product-category", adminController.showProductCategory);
Router.post(
  "/product-category",
  tokenVerify,
  adminController.addProductCategory
);
Router.put(
  "/product-category/:cid",
  tokenVerify,
  adminController.editProductCategory
);
Router.delete(
  "/product-category/:cid",
  tokenVerify,
  adminController.deleteProductCategory
);

Router.get("/login", adminController.login);

Router.get("/verify-token", adminController.verifyToken);
Router.get("/fetch-warehouse", adminController.fetchWarehouse);
Router.get("/adminData", adminController.adminData);
Router.get("/userData", adminController.userData);
Router.post("/addAdmin", adminController.addAdmin);
Router.patch("/editAdmin", adminController.editAdmin);
Router.delete("/deleteAdminData", adminController.deleteAdminData);
Router.get("/adminWarehouse", adminController.adminWarehouse);
Router.get("/admin-all-stats", adminController.adminAllStats);
Router.get("/admin-type", adminController.adminType);
Router.get("/local-admin", adminController.localAdmin);

module.exports = Router;
