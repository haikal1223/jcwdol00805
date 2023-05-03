const express = require("express");
const Router = express.Router();

const { courierController } = require("../controller");
const { tokenVerify } = require("../middleware/verifyToken");

Router.post("/costJNE", tokenVerify, courierController.getJNE);
Router.post("/costPOS", tokenVerify, courierController.getPOS);
Router.post("/costTIKI", tokenVerify, courierController.getTIKI);
Router.post("/cost", tokenVerify, courierController.getCost);

module.exports = Router;
