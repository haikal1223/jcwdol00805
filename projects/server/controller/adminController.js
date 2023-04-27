// Import Models
const db = require("../sequelize/models/index");

// Import Hashing
const { matchPassword } = require("../lib/hash");
const { Sequelize, Op } = require("sequelize");

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

      const createdDate = new Date(order.createdAt);
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

  productStockByWarehouse: async (req, res) => {
    try {
      const { uid } = req.uid;
      const { Op } = require("sequelize");
      const { warehouseId } = req.query;

      const user = await db.user.findOne({ where: { uid } });
      if (user.role === "warehouse_admin") {
        const whAdmin = await db.wh_admin.findOne({
          where: { user_id: user.id, warehouse_id: warehouseId },
        });
        if (!whAdmin) {
          return res.status(401).send({
            isError: true,
            message: "Unauthorized access",
            data: null,
          });
        }
      } else if (user.role !== "admin") {
        return res.status(401).send({
          isError: true,
          message: "Unauthorized access",
          data: null,
        });
      }

      const latestProductStocks = await db.product_stock.findAll({
        attributes: [
          [db.sequelize.fn("max", db.sequelize.col("id")), "latest_id"],
          "product_id",
          "warehouse_id",
        ],
        group: ["product_id", "warehouse_id"],
        raw: true,
      });

      const latestStockByProductAndWarehouse = latestProductStocks.reduce(
        (acc, curr) => {
          const key = `${curr.product_id}-${curr.warehouse_id}`;
          acc[key] = curr.latest_id;
          return acc;
        },
        {}
      );

      const products = await db.product_stock.findAll({
        where: {
          warehouse_id: warehouseId,
          id: Object.values(latestStockByProductAndWarehouse),
        },
        attributes: [
          "id",
          "product_id",
          [
            db.sequelize.literal(
              "(SELECT name FROM product WHERE id = `product_stock`.`product_id`)"
            ),
            "product_name",
          ],
          "stock",
          [
            db.sequelize.literal(
              "(SELECT name FROM warehouse WHERE id = `product_stock`.`warehouse_id`)"
            ),
            "warehouse_name",
          ],
        ],
        order: [["product_id", "ASC"]],
      });

      return res.status(200).send({
        isError: false,
        message: "Success",
        data: products,
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

  fetchWarehouse: async (req, res) => {
    try {
      const warehouses = await db.warehouse.findAll();
      return res.status(200).send({
        isError: false,
        message: "Warehouse data fetched successfully",
        data: warehouses.map((warehouse) => ({
          id: warehouse.id,
          name: warehouse.name,
          city: warehouse.city,
          province: warehouse.province,
          lat: warehouse.lat,
          lng: warehouse.lng,
        })),
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

  fetchProduct: async (req, res) => {
    try {
      const products = await db.product.findAll();
      return res.status(200).send({
        isError: false,
        message: "Product data fetched successfully",
        data: products.map((product) => ({
          id: product.id,
          name: product.name,
        })),
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

  summaryAllProductMonthly: async (req, res) => {
    try {
      const { uid } = req.uid;
      const { Op } = require("sequelize");
      const { month, year, warehouse_id } = req.query;
      const moment = require("moment");

      const user = await db.user.findOne({ where: { uid } });
      if (user.role === "warehouse_admin") {
        const whAdmin = await db.wh_admin.findOne({
          where: { user_id: user.id, warehouse_id: warehouseId },
        });
        if (!whAdmin) {
          return res.status(401).send({
            isError: true,
            message: "Unauthorized access",
            data: null,
          });
        }
      } else if (user.role !== "admin") {
        return res.status(401).send({
          isError: true,
          message: "Unauthorized access",
          data: null,
        });
      }
      const sequelize = db.sequelize;

      const rawQuery = `
      WITH raw AS 
      (
      SELECT
          product_id
          , warehouse_id
          , old_stock
          , createdAt
          , row_number() over(partition by warehouse_id order by createdAt ASC) as row_num
      FROM stock_log WHERE (:month IS NULL OR MONTH(createdAt) = :month) AND (:year IS NULL OR YEAR(createdAt) = :year) 
      ), latest_stock AS 
      (
      SELECT
          product_id
          , warehouse_id
          , stock
      FROM product_stock WHERE (:month IS NULL OR MONTH(createdAt) = :month) AND (:year IS NULL OR YEAR(createdAt) = :year) 
      ),mutation AS
      (
      SELECT a.*
          , new_stock - old_stock as diff
          FROM stock_log a WHERE (:month IS NULL OR MONTH(createdAt) = :month) AND (:year IS NULL OR YEAR(createdAt) = :year) 
      )
      SELECT a.product_id, p.name as product_name, a.warehouse_id, coalesce(x.old_stock, 0) as Initial_Stock,b.stock as latest_stock , SUM(CASE 
          WHEN diff > 0 THEN diff ELSE 0 END)
          as addition, SUM(CASE 
          WHEN diff < 0 THEN diff ELSE 0 END)
          as reduction
      FROM 
      product_stock as a LEFT JOIN
      raw as x ON a.product_id = x.product_id AND a.warehouse_id = x.warehouse_id 
      AND row_num = 1
      LEFT JOIN
      latest_stock as b ON a.product_id = b.product_id AND a.warehouse_id = b.warehouse_id
      LEFT JOIN
      mutation as c ON c.product_id = a.product_id AND c.warehouse_id = a.warehouse_id 
      LEFT JOIN
      product as p ON p.id = a.product_id
      WHERE a.warehouse_id=:warehouse_id
      GROUP BY 1,2,3
      `;

      const result = await sequelize.query(rawQuery, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { month, year, warehouse_id },
      });

      return res.status(200).send({
        isError: false,
        message: "Summary of all products",
        data: result,
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

  fetchStockLog: async (req, res) => {
    try {
      const { uid } = req.uid;
      const { Op } = require("sequelize");
      const { product_id, warehouse_id, month, year } = req.query;
      const moment = require("moment");

      const user = await db.user.findOne({ where: { uid } });
      if (user.role === "warehouse_admin") {
        const whAdmin = await db.wh_admin.findOne({
          where: { user_id: user.id, warehouse_id },
        });
        if (!whAdmin) {
          return res.status(401).send({
            isError: true,
            message: "Unauthorized access",
            data: null,
          });
        }
      } else if (user.role !== "admin") {
        return res.status(401).send({
          isError: true,
          message: "Unauthorized access",
          data: null,
        });
      }

      const startDate = moment(`${year}-${month}-01`).startOf("month");
      const endDate = moment(startDate).endOf("month");

      const stockLogs = await db.stock_log.findAll({
        where: {
          product_id,
          warehouse_id,
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      return res.status(200).send({
        isError: false,
        message: "Success",
        data: stockLogs,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        isError: true,
        message: "Internal server error",
        data: null,
      });
    }
  },
};
