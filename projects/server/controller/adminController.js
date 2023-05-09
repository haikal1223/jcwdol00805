// Import Models
const db = require("../sequelize/models/index");

// Import Hashing
const { matchPassword } = require("../lib/hash");

// Import jwt
const { createToken } = require("../lib/jwt");

module.exports = {
  login: async (req, res) => {
    try {
      let { email, password } = req.query;

      if (!email || !password)
        return res.status(404).send({
          iserror: true,
          message: "Email or password is empty",
          data: null,
        });

      let findEmail = await db.user.findOne({
        where: { email: email },
      });

      if (!findEmail) {
        return res.status(401).send({
          iserror: true,
          message: "Email not found",
          data: null,
        });
      } else if (findEmail.dataValues.role === "user") {
        return res.status(401).send({
          isError: true,
          message: "Unauthorized access",
          data: null,
        });
      } else {
        let matchPasswordResult = await matchPassword(
          password,
          findEmail.dataValues.password
        );

        if (matchPasswordResult === false)
          return res.status(401).send({
            isError: true,
            message: "Incorrect password",
            data: null,
          });

        res.status(200).send({
          isError: false,
          message: "Login Success",
          data: {
            token: createToken({ uid: findEmail.dataValues.uid }),
            email: findEmail.dataValues.email,
            role: findEmail.dataValues.role,
          },
        });
      }
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: true,
      });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { uid } = req.uid;
      console.log("X", uid);

      const user = await db.user.findOne({ where: { uid } });
      if (user.role !== "admin") {
        return res.status(401).send({
          isError: true,
          message: "Unauthorized access",
          data: null,
        });
      }

      const orderId = req.params.orderId;
      const newStatusId = 4; // status id for "Shipped"
      const order = await db.order.findByPk(orderId);
      if (!order) {
        return res.status(404).send({
          isError: true,
          message: "Order not found",
          data: null,
        });
      }

      if (order.order_status_id !== 3) {
        return res.status(400).send({
          isError: true,
          message: "Order status cannot be changed",
          data: null,
        });
      }

      order.order_status_id = newStatusId;
      await order.save();

      return res.status(200).send({
        isError: false,
        message: "Order status updated successfully",
        data: order,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).send({
        isError: true,
        message: "Internal server error",
        data: null,
      });
    }
  },

  updateUserOrderStatus: async (req, res) => {
    try {
      const { uid } = req.uid;

      const user = await db.user.findOne({ where: { uid } });
      if (user.role !== "admin") {
        return res.status(401).send({
          isError: true,
          message: "Unauthorized access",
          data: null,
        });
      }

      const orderId = req.params.orderId;
      const newStatusId = 5; // status id for "Delivered"
      const order = await db.order.findByPk(orderId);
      if (!order) {
        return res.status(404).send({
          isError: true,
          message: "Order not found",
          data: null,
        });
      }

      if (order.order_status_id !== 4) {
        return res.status(400).send({
          isError: true,
          message: "Order status cannot be changed",
          data: null,
        });
      }

      const createdDate = new Date(order.created_at);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      if (createdDate > oneWeekAgo) {
        return res.status(400).send({
          isError: true,
          message: "Cannot change order status yet",
          data: null,
        });
      }

      order.order_status_id = newStatusId;
      await order.save();

      return res.status(200).send({
        isError: false,
        message: "Order status updated successfully",
        data: order,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).send({
        isError: true,
        message: "Internal server error",
        data: null,
      });
    }
  },

  showOrderData: async (req, res) => {
    try {
      let data = await db.order.findAll({});
      res.status(200).send({
        isError: false,
        message: "Get Order Success.",
        data: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).send({
        isError: true,
        message: "Internal server error",
        data: null,
      });
    }
  },
};
