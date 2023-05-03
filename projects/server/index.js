require("dotenv/config");
const express = require("express");
const cors = require("cors");
const { join } = require("path");
const mysql2 = require("mysql2");

const PORT = process.env.PORT || 8000;
const app = express();
app.use(
  cors()
  // {
  //   origin: [
  //     process.env.WHITELISTED_DOMAIN &&
  //       process.env.WHITELISTED_DOMAIN.split(","),
  //   ],
  // }
);

app.use(express.json());
app.use(express.static("public"));

//#region API ROUTES

// ===========================
// NOTE : Add your routes here


const { userRouter, courierRouter } = require("./router");
const { productRouter } = require('./router')
const { addressRouter } = require('./router')
const { cartRouter } = require('./router')
const { adminRouter } = require('./router')
const { adminOrderRouter } = require('./router')
const { adminProductRouter } = require('./router')
const { adminMutationRouter } = require('./router')
app.use('/admin-mutation', adminMutationRouter)
app.use('/admin-product', adminProductRouter)
app.use('/admin', adminRouter)
app.use('/admin-order', adminOrderRouter)
app.use('/cart', cartRouter)
app.use("/user", userRouter);
app.use('/product', productRouter)
app.use('/address', addressRouter)
app.use("/courier", courierRouter);

// app.get("/api", (req, res) => {
//   res.send(`Hello, this is my API`);
// });

// app.get("/api/greetings", (req, res, next) => {
//   res.status(200).json({
//     message: "Hello, Student !",
//   });
// });

// // ===========================

// // not found
// app.use((req, res, next) => {
//   if (req.path.includes("/api/")) {
//     res.status(404).send("Not found !");
//   } else {
//     next();
//   }
// });

// // error
// app.use((err, req, res, next) => {
//   if (req.path.includes("/api/")) {
//     console.error("Error : ", err.stack);
//     res.status(500).send("Error !");
//   } else {
//     next();
//   }
// });

// //#endregion

// //#region CLIENT
// const clientPath = "../../client/build";
// app.use(express.static(join(__dirname, clientPath)));

// // Serve the HTML page
// app.get("*", (req, res) => {
//   res.sendFile(join(__dirname, clientPath, "index.html"));
// });

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
