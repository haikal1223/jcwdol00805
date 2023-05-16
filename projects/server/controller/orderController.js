const db = require("../sequelize/models");
const { Op } = require("sequelize");
const { default: axios } = require("axios");
const { createToken, validateToken } = require("../lib/jwt");

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
      const { order_id } = req.query;

      let cancelOrder = await db.order.update(
        {
          order_status_id: 6,
        },
        {
          where: {
            id: order_id,
          },
        }
      );

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

  delivered: async (req, res) => {
    try {
      const { order_id } = req.query;

      let deliveredOrder = await db.order.update(
        {
          order_status_id: 5,
        },
        {
          where: {
            id: order_id,
          },
        }
      );

      return res.status(200).send({
        isError: false,
        message: "Order delivered successfully",
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
        data: { findOrderDetail, id },
      });
    } catch (error) {
      return res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  getCart: async (req, res) => {
    try {
      const { id } = req.uid;

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

  createOrder: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { id } = req.uid;
      // get data
      let { paid_amt, address, ship_cost, uid, whid } = req.query;
      let { cartId } = req.body;

      console.log(id);

      // fetch checkout cart ischecked
      let carts = await db.sequelize.query(
        `SELECT a.product_id, a.price, a.quantity, b.name
        FROM db_warehouse.carts a
        LEFT JOIN product b on a.product_id = b.id
        WHERE a.is_checked = 1 AND a.user_id = ${uid}`
      );
      /* const cartItems = await db.cart.findAll({
        where: {
          user_id: id,
          is_checked: 1,
        },
      }); */

      let detail = carts[0];

      //validate product availability
      for (let i = 0; i < detail.length; i++) {
        let stock = await db.product_stock.sum(
          "stock",
          {
            where: {
              product_id: detail[i].product_id,
            },
          },
          {
            group: "product_id",
          }
        );

        if (stock < detail[i].quantity) {
          return res.status(500).send({
            isError: true,
            message: `Insufficient stock for item ${detail[i].name}`,
            data: null,
          });
        }
      }

      // run query
      let order = await db.order.create(
        {
          paid_amount: parseInt(paid_amt),
          user_address_id: parseInt(address),
          shipping_cost: parseInt(ship_cost),
          order_status_id: 1,
          user_id: parseInt(uid),
          warehouse_id: parseInt(whid),
        } /* , { transaction: t } */
      );

      /* NEED LOOP */
      for (let i = 0; i < detail.length; i++) {
        await db.order_detail.create(
          {
            order_id: order.id,
            product_id: detail[i].product_id,
            product_price: detail[i].price,
            product_quantity: detail[i].quantity,
            subtotal: detail[i].price * detail[i].quantity,
          } /* , { transaction: t } */
        );
      }

      // loop to destroy cart
      for (let i = 0; i < cartId.length; i++) {
        await db.cart.destroy({
          where: {
            id: cartId[i],
          },
        });
      }

      // response
      res.status(201).send({
        isError: false,
        message: "Order successfully created",
        data: {
          order,
          carts,
        },
      });
    } catch (error) {
      t.rollback();
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  uploadPayment: async (req, res) => {
    try {
      let { id } = req.query;

      await db.order.update(
        {
          payment_proof: req.files.payments[0].path,
          order_status_id: 2,
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(201).send({
        isError: false,
        message: "Your payment proof is uploaded!",
        data: null,
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
};
