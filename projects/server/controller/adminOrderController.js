const { sequelize } = require("../sequelize/models");
// Import Models
const db = require("../sequelize/models/index");

// Import Hashing
const { hashPassword, matchPassword } = require("../lib/hash");

// Import jwt
const { createToken, validateToken } = require("../lib/jwt");

// Import multer
const { uploader } = require("../lib/multer");

// Import Filesystem
const fs = require("fs").promises;

// Import Transporter
const transporter = require("../helper/transporter");

// Import handlebars
const handlebars = require("handlebars");
const { kStringMaxLength } = require("buffer");

const bcrypt = require("bcrypt");

module.exports = {
  viewOrder: async (req, res) => {
    try {
      // limit by warehouse id
      let { wh_id } = req.params;
      let { id, wh, sort, offset, row } = req.query;

      let whereClause;
      if (wh_id === "all") {
        if (id != "") {
          whereClause = ` WHERE c.name LIKE '%${wh}%' AND a.id = ${parseInt(
            id
          )}`;
        } else {
          whereClause = ` WHERE c.name LIKE '%${wh}%'`;
        }
      } else if (parseInt(wh_id) > 0) {
        if (id != "") {
          whereClause = ` WHERE warehouse_id = ${wh_id} AND a.id = ${parseInt(
            id
          )}`;
        } else {
          whereClause = ` WHERE warehouse_id = ${wh_id}`;
        }
      }

      // run query
      let orders = await sequelize.query(
        `SELECT a.*, b.status , c.name as wh_name , d.email as user_email, count(e.product_id) as num_item
                FROM db_warehouse.order a 
                LEFT JOIN order_status b ON a.order_status_id=b.id
                LEFT JOIN warehouse c ON a.warehouse_id = c.id
                LEFT JOIN users d ON a.user_id = d.id
                LEFT JOIN order_detail e ON a.id = e.order_id
                ${whereClause} GROUP BY 1,2,3,4,5,6,7,8,9,10,11,12,13 ${sort} LIMIT ${row} OFFSET ${offset}`
      );

      let countOrders = await sequelize.query(
        `SELECT count(DISTINCT a.id) as num_order
                FROM db_warehouse.order a 
                LEFT JOIN order_status b ON a.order_status_id=b.id
                LEFT JOIN warehouse c ON a.warehouse_id = c.id
                LEFT JOIN users d ON a.user_id = d.id
                LEFT JOIN order_detail e ON a.id = e.order_id
                ${whereClause}`
      );

      let wh_list = await sequelize.query(
        `SELECT DISTINCT c.name AS wh_name
                FROM db_warehouse.order a 
                LEFT JOIN order_status b ON a.order_status_id=b.id
                LEFT JOIN warehouse c ON a.warehouse_id = c.id
                LEFT JOIN users d ON a.user_id = d.id
                LEFT JOIN order_detail e ON a.id = e.order_id
                ${wh_id === "all" ? "" : `WHERE warehouse_id = ${wh_id}`}`
      );

      // response
      res.status(201).send({
        isError: false,
        message: "Order list returned",
        data: {
          orders,
          countOrders,
          wh_list,
        },
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  orderDetail: async (req, res) => {
    try {
      // fetch order id
      let { id } = req.params;
      // run query
      const order_detail = await sequelize.query(
        `SELECT a.*, b.status , c.name as wh_name , d.email as user_email
                FROM db_warehouse.order a 
                LEFT JOIN order_status b ON a.order_status_id=b.id
                LEFT JOIN warehouse c ON a.warehouse_id = c.id
                LEFT JOIN users d ON a.user_id = d.id
                WHERE a.id=${id}`
      );

      const product_detail = await sequelize.query(
        `SELECT a.*, b.name
                FROM db_warehouse.order_detail a
                LEFT JOIN product b
                ON a.product_id = b.id
                WHERE order_id=${id}`
      );

      //response
      res.status(201).send({
        isError: false,
        message: "order detail fetched",
        data: {
          order_detail,
          product_detail,
        },
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  cancelOrder: async (req, res) => {
    try {
      let { id } = req.params;

      let updateStatus = await db.order.update(
        {
          order_status_id: 6,
        },
        {
          where: {
            id,
          },
        }
      );

      let orderDetail = await db.order_detail.findAll({
        where: {
          order_id: id,
        },
      });

      let order = await db.order.findOne({
        where: {
          id,
        },
      });

      for (i = 0; i < orderDetail.length; i++) {
        let getStock = await db.product_stock.findOne({
          where: {
            product_id: orderDetail[i].product_id,
            warehouse_id: order.warehouse_id,
          },
        });
        let oldStock = getStock.stock;
        let newStock = oldStock + orderDetail[i].product_quantity;

        let updateStock = await db.product_stock.update(
          {
            stock: newStock,
          },
          {
            where: {
              product_id: orderDetail[i].product_id,
              warehouse_id: order.warehouse_id,
            },
          }
        );

        let updateStockLog = await db.stock_log.create({
          old_stock: oldStock,
          new_stock: newStock,
          order_id: id,
          product_id: orderDetail[i].product_id,
        });
      }

      //response
      res.status(201).send({
        isError: false,
        message: "cancel order success",
        data: {
          updateStatus,
          orderDetail,
          order,
        },
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
};
