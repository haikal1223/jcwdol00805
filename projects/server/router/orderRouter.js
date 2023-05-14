const express = require("express");
const Router = express.Router();

const { orderController } = require("../controller");
const { tokenVerify } = require("../middleware/verifyToken");

//Import multer
const uploadImages = require("../middleware/upload");
const { multerUpload } = require("./../lib/multer");

Router.get("/getOrderCart", tokenVerify, orderController.getCart);
Router.get("/getOrderList", tokenVerify, orderController.getOrderList);
Router.patch("/cancel", orderController.cancel);
Router.get("/getOrder", tokenVerify, orderController.getOrder);

Router.post("/create-order", tokenVerify, orderController.createOrder);



Router.patch(
    "/upload-payment",
    multerUpload.fields([{ name: "payments", maxCount: 1 }]),
    orderController.uploadPayment
  );
  

module.exports = Router;
