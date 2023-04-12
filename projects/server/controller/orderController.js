const db = require("../sequelize/models");
const { Op } = require("sequelize");
const { default: axios } = require("axios");

function generateInvoiceNumber() {
  const randomStr = Math.random().toString(36).substr(2, 5);
  const timestamp = Date.now().toString().substr(-5);
  return `INV-${randomStr}-${timestamp}`;
}

module.exports = {
  getOrderList: async (req, res) => {
    try {
      const { id } = req.uid;

      if (!id) {
        return res.status(400).send({
          isError: true,
          message: "Invalid user ID",
          data: null,
        });
      }

      const findOrder = await db.order.findAll({
        where: {
          user_id: id,
        },
        include: [
          {
            model: db.order_status,
          },
        ],
      });

      if (!findOrder) {
        return res.status(404).send({
          isError: true,
          message: "No Order Found",
          data: null,
        });
      }

      return res.status(200).send({
        isError: false,
        message: "Cart items fetched successfully",
        data: findOrder,
      });
    } catch (error) {
      return res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  cancel: async (req, res) => {
    try {
      const { uid } = req.uid;
      if (!uid) {
        return res.status(400).send({
          isError: true,
          message: "Invalid user ID",
          data: null,
        });
      }
      const user = await db.user.findOne({
        where: {
          uid,
        },
      });
      const order = await db.order.findOne({
        where: {
          user_id: user.id,
          payment_proof: {
            [Op.ne]: null,
          },
        },
      });
      if (!order) {
        return res.status(404).send({
          isError: true,
          message: "No order found with pending payment proof",
          data: null,
        });
      }
      await order.destroy();
      return res.status(200).send({
        isError: false,
        message: "Order cancelled successfully",
        data: null,
      });
    } catch (error) {
      return res.status(500).send({
        isError: true,
        message: "Internal server error",
        data: null,
      });
    }
  },

  getOrder: async (req, res) => {
    try {
      const { id } = req.uid;
      const { orderId } = req.query;

      const findOrderDetail = await db.order_detail.findAll({
        where: {
          order_id: orderId,
        },
        include: [
          {
            model: db.order,
            include: [
              {
                model: db.order_status,
              },
              {
                model: db.user_address,
              },
              {
                model: db.user,
              },
            ],
          },
          {
            model: db.product,
            attributes: ["name", "price", "product_category_id", "image_url"],
          },
        ],
      });

      return res.status(200).send({
        isError: false,
        message: "Cart items fetched successfully",
        data: findOrderDetail,
      });
    } catch (error) {
      return res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
};
