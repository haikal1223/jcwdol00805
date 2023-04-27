const db = require("../sequelize/models");
const { Op } = require("sequelize");
const { default: axios } = require("axios");

function generateInvoiceNumber() {
  const randomStr = Math.random().toString(36).substr(2, 5);
  const timestamp = Date.now().toString().substr(-5);
  return `INV-${randomStr}-${timestamp}`;
}

module.exports = {
  getCart: async (req, res) => {
    try {
      const { uid } = req.uid;

      if (!uid) {
        return res.status(400).send({
          isError: true,
          message: "Invalid user ID",
          data: null,
        });
      }

      const { id } = await db.user.findOne({
        where: {
          uid,
        },
      });

      const order = await db.order.findOne({
        where: {
          user_id: id,
        },
      });

      const findUserOrder = await db.order_detail.findAll({
        where: {
          order_id: order.id,
        },
        include: [
          {
            model: db.order,
          },
          {
            model: db.product,
            attributes: ["name", "price", "product_category_id", "image_url"],
          },
        ],
      });

      if (!findUserOrder) {
        return res.status(404).send({
          isError: true,
          message: "No Order Found",
          data: null,
        });
      }

      return res.status(200).send({
        isError: false,
        message: "Cart items fetched successfully",
        data: findUserOrder,
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

await order.update({ order_status_id: 6 });

return res.status(200).send({
  isError: false,
  message: "Order cancelled successfully",
  data: null,
});
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        isError: true,
        message: "Internal server error",
        data: null,
      });
    }
  },
};
