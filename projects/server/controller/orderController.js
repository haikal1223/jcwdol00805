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

  createOrder: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      // get data
      let { paid_amt, address, ship_cost, uid, whid } = req.query
      let { detail, cartId } = req.body

      // dummy order
      /* paid_amt = 1
      address = 1
      ship_cost = 15000
      uid = 1
      whid = 1 */
      
      // dummy detail
      detail = [
        {
          pid: 2,
          name: 'Test Product AA',
          price: 14000,
          qty: 1
        },
        {
          pid: 27,
          name: 'Test Product BB',
          price: 25000,
          qty: 2
        }
      ]

      /* cartId = [1 , 2] */

      //validate product availability
      for( let i = 0 ; i < detail.length ; i++ ) {
        let stock = await db.product_stock.sum(
          'stock',{
            where: {
              product_id: detail[i].pid
            }
          }, {
            group: 'product_id' 
          })
          
        if (stock < detail[i].qty) {
          return res.status(500).send({
            isError: true,
            message: `Insufficient stock for item ${detail[i].name}`,
            data: null,
          })
        }  
      }

      // run query
      let order = await db.order.create({
        paid_amount: parseInt(paid_amt),
        user_address_id: parseInt(address),
        shipping_cost: parseInt(ship_cost),
        order_status_id: 1,
        user_id: parseInt(uid),
        warehouse_id: parseInt(whid)
      }/* , { transaction: t } */) 

      /* NEED LOOP */
      for( let i = 0 ; i < detail.length ; i++ ) {
        await db.order_detail.create({
          order_id: order.id, 
          product_id: detail[i].pid,
          product_price: detail[i].price,
          product_quantity: detail[i].qty,
          subtotal: detail[i].price * detail[i].qty 
        }/* , { transaction: t } */)
      }

      // loop to destroy cart
      for ( let i = 0 ; i < cartId.length ; i++) {
        await db.cart.destroy({
          where : {
            id: cartId[i]
          }
        })
      }
      
      // response
      res.status(201).send({
        isError: false,
        message: 'Order successfully created',
        data: {
          order
        }
      })

    } catch (error) {
      t.rollback();
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  }

};
