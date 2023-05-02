
const cartRouter = require('./cartRouter')
const productRouter = require('./productRouter')
const userRouter = require('./userRouter')
const addressRouter = require('./addressRouter')
const adminRouter = require('./adminRouter')
const adminOrderRouter = require('./adminOrderRouter')
const adminProductRouter = require('./adminProductRouter')
const adminMutationRouter = require('./adminMutationRouter')
const courierRouter = require("./courierRouter");


module.exports = {
    cartRouter,
    productRouter,
    userRouter,
    adminRouter,
    adminOrderRouter,
    adminProductRouter,
    adminMutationRouter,
    addressRouter,
    courierRouter
    
}


