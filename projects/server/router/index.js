const cartRouter = require('./cartRouter')
const productRouter = require('./productRouter')
const userRouter = require('./userRouter')
const addressRouter = require('./addressRouter')
const adminRouter = require('./adminRouter')
const adminOrderRouter = require('./adminOrderRouter')
const adminProductRouter = require('./adminProductRouter')


module.exports = {
    cartRouter,
    productRouter,
    userRouter,
    adminRouter,
    adminOrderRouter,
    adminProductRouter,
    addressRouter
}