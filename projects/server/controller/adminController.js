const { sequelize } = require("../sequelize/models");

// Import Models
const db = require("../sequelize/models/index");

// Import Hashing
const { matchPassword, hashPassword } = require("../lib/hash");

// Import jwt
const { createToken, validateToken } = require("../lib/jwt");
const { Sequelize } = require("../sequelize/models/index");
const warehouse = require("../sequelize/models/warehouse");

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
            token: createToken({ id: findEmail.dataValues.id }),
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

  assignWarehouseAdmin: async (req, res) => {
    try {
      const { id } = req.uid;

      const users = await db.user.findOne({
        where: { id: id },
      });

      if (users.role !== "admin") {
        return res.status(403).send({
          isError: true,
          message: "Only Admin User can access",
          data: null,
        });
      }

      const { warehouseId, warehouseAdminId } = req.body;

      const warehouse = await db.warehouse.findByPk(warehouseId);
      const warehouseAdmin = await db.user.findByPk(warehouseAdminId);
      if (!warehouse || !warehouseAdmin) {
        return res.status(404).send({
          isError: true,
          message: "Warehouse or warehouse admin not found",
          data: null,
        });
      }

      await db.wh_admin.create({
        warehouse_id: warehouseId,
        user_id: warehouseAdminId,
      });

      await db.user.update(
        { role: "warehouse_admin" },
        { where: { id: warehouseAdminId } }
      );

      const isAssigned = await db.wh_admin.findOne({
        where: { user_id: warehouseAdminId },
      });

      if (!isAssigned) {
        await db.user.update(
          { role: "user" },
          { where: { id: warehouseAdminId } }
        );
      }

      res.status(200).send({
        isError: false,
        message: "Warehouse admin assigned successfully",
        data: null,
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
      });
    }
  },

  showProductCategory: async (req, res) => {
    try {
      let data = await db.product_category.findAll({});
      res.status(200).send({
        isError: false,
        message: "Get Product Category Success.",
        data: data,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: "Error on getting data product category",
        data: null,
      });
    }
  },

  verifyToken: async (req, res) => {
    try {
      let { token } = req.query;

      if (!token) {
        return res.status(401).send({
          isError: true,
          message: "Token not found",
          data: null,
        });
      }

      const validateTokenResult = validateToken(token);
      return res.status(200).send({
        isError: false,
        message: "Token is found",
        data: validateTokenResult,
      });
    } catch (error) {
      res.status(401).send({
        isError: true,
        message: "Invalid Token",
        data: null,
      });
    }
  },

  fetchWhId: async (req, res) => {
    try {
      // get value
      let { id } = req.query;

      // fetch wh_id
      let get_whid = await sequelize.query(
        `SELECT CASE 
                WHEN a.role='admin' THEN 'all'
                WHEN a.role='wh_admin' THEN warehouse_id
                END AS wh_id
                FROM wh_admin 
                RIGHT JOIN users a
                ON a.id = wh_admin.user_id
                WHERE a.id='${id}'`
      );

      // send response
      res.status(200).send({
        isError: false,
        message: "wh_id admin fetched",
        data: get_whid,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  adminData: async (req, res) => {
    try {
      let { offset, row, name, sort, sortMode } = req.query;
      let column = "id";
      switch (sort) {
        case "sortId":
          column = "id";
          break;
        case "sortEmail":
          column = "email";
          break;
        case "sortFirstName":
          column = "first_name";
          break;
        case "sortLastName":
          column = "last_name";
          break;
        case "sortRole":
          column = "role";
          break;
      }

      let findAdmin = await db.user.findAll({
        include: [
          {
            model: db.wh_admin,
            include: [{ model: db.warehouse }],
          },
        ],

        where: {
          role: { [Sequelize.Op.like]: `%admin%` },
          [Sequelize.Op.or]: [
            { first_name: { [Sequelize.Op.like]: `%${name}%` } },
            { last_name: { [Sequelize.Op.like]: `%${name}%` } },
          ],
        },
        order: [[column, sortMode]],
        limit: parseInt(row),
        offset: parseInt(offset),
      });

      let findAdminAll = await db.user.findAll({
        where: {
          role: { [Sequelize.Op.like]: `%admin%` },
          [Sequelize.Op.or]: [
            { first_name: { [Sequelize.Op.like]: `%${name}%` } },
            { last_name: { [Sequelize.Op.like]: `%${name}%` } },
          ],
        },
      });

      res.status(200).send({
        isError: false,
        message: "Get Admin Data Success",
        data: { findAdmin, findAdminAll },
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  addProductCategory: async (req, res) => {
    try {
      const { id } = req.uid;

      console.log("a", id);

      const user = await db.user.findOne({ where: { id } });

      if (user.role !== "admin") {
        return res.status(401).send({
          isError: true,
          message: "Unauthorized access",
          data: null,
        });
      }

      const { category_name } = req.body;

      const checkDupes = await db.product_category.findOne({
        where: { category_name: category_name },
      });

      if (checkDupes) {
        return res.status(400).send({
          isError: true,
          message: "Category already exist",
          data: null,
        });
      }

      const newCategory = await db.product_category.create({ category_name });

      res.status(201).send({
        isError: false,
        message: "New Product Category has been added to database",
        data: newCategory,
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: true,
      });
    }
  },

  adminWarehouse: async (req, res) => {
    try {
      let findWarehouse = await db.warehouse.findAll({});
      res.status(200).send({
        isError: false,
        message: "Get Warehouse Data Success",
        data: findWarehouse,
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: true,
      });
    }
  },

  userData: async (req, res) => {
    try {
      let { offset, row, name, sort, sortMode } = req.query;
      console.log(offset);
      let column = "id";
      switch (sort) {
        case "sortId":
          column = "id";
          break;
        case "sortEmail":
          column = "email";
          break;
        case "sortFirstName":
          column = "first_name";
          break;
        case "sortLastName":
          column = "last_name";
          break;
        case "sortGender":
          column = "gender";
          break;
      }

      let findUser = await db.user.findAll({
        where: {
          role: "user",
          [Sequelize.Op.or]: [
            { first_name: { [Sequelize.Op.like]: `%${name}%` } },
            { last_name: { [Sequelize.Op.like]: `%${name}%` } },
          ],
        },
        order: [[column, sortMode]],
        limit: parseInt(row),
        offset: parseInt(offset),
      });

      let findUserAll = await db.user.findAll({
        where: {
          role: "user",
          [Sequelize.Op.or]: [
            { first_name: { [Sequelize.Op.like]: `%${name}%` } },
            { last_name: { [Sequelize.Op.like]: `%${name}%` } },
          ],
        },
      });

      res.status(200).send({
        isError: false,
        message: "Get User Data Success",
        data: { findUser, findUserAll },
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: true,
      });
    }
  },

  editProductCategory: async (req, res) => {
    try {
      const { id } = req.uid;
      console.log("a");

      const user = await db.user.findOne({ where: { id } });
      if (user.role !== "admin") {
        return res.status(401).send({
          isError: true,
          message: "Unauthorized access",
          data: null,
        });
      }
      const { category_name } = req.body;
      const { cid } = req.params;
      const checkDupes = await db.product_category.findOne({
        where: { category_name: category_name },
      });

      if (checkDupes) {
        return res.status(400).send({
          isError: true,
          message: "Category already exist",
          data: null,
        });
      }

      const category = await db.product_category.findOne({
        where: { id: cid },
      });
      if (!category) {
        res.status(404).send({
          isError: true,
          message: "No Product Category Founded.",
          data: null,
        });
      }
      await category.update({ category_name });
      res.status(200).send({
        isError: false,
        message: "Product Category has been edited",
        data: category,
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: "Error on Updating category",
        data: null,
      });
    }
  },
  deleteProductCategory: async (req, res) => {
    try {
      const { id } = req.uid;

      const user = await db.user.findOne({ where: { id } });
      if (user.role !== "admin") {
        return res.status(401).send({
          isError: true,
          message: "Unauthorized access",
          data: null,
        });
      }
      const { cid } = req.params;
      const category = await db.product_category.findOne({
        where: { id: cid },
      });
      console.log("s", category);

      if (!category) {
        res.status(404).send({
          isError: true,
          message: "No Product Category Founded.",
          data: null,
        });
      }

      await category.destroy({ where: { id: cid } });
      res.status(200).send({
        isError: false,
        message: "Product Category Removed",
        data: null,
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: "Error on Removing category",
        data: null,
      });
    }
  },

  addAdmin: async (req, res) => {
    try {
      let { email, first_name, last_name, role, warehouse_name, password } =
        req.body;

      if (!email || !first_name || !last_name || !role || !password)
        return res.status(404).send({
          isError: true,
          message: "Please Complete Registration Data",
          data: null,
        });

      if (role === "wh_admin") {
        if (!warehouse_name)
          return res.status(404).send({
            isError: true,
            message: "Please Complete Registration Data",
            data: null,
          });
      }

      let findEmail = await db.user.findOne({
        where: {
          email: email,
        },
      });

      if (findEmail)
        return res.status(404).send({
          isError: true,
          message: "Email already exist",
          data: null,
        });

      const hashedPassword = await hashPassword(password);

      let dataToSend = await db.user.create({
        email,
        first_name,
        last_name,
        password: hashedPassword,
        is_verified: 1,
        role,
      });

      findEmail = await db.user.findOne({
        where: {
          email: email,
        },
      });

      if (role === "wh_admin") {
        let findWarehouse = await db.warehouse.findOne({
          where: {
            name: warehouse_name,
          },
        });

        let whAdminData = await db.wh_admin.create({
          user_id: findEmail.dataValues.id,
          warehouse_id: findWarehouse.dataValues.id,
        });
      }

      res.status(201).send({
        isError: false,
        message: "Registration Success",
        data: null,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: "Registration Failed",
        data: error,
      });
    }
  },

  showAllUserData: async (req, res) => {
    try {
      const allUsers = await db.user.findAll({});
      const allWHData = await db.wh_admin.findAll({
        include: { model: db.user },
      });
      res.status(201).send({
        isError: false,
        message: "All User Data",
        data: allUsers,
        allWHData,
      });
      console.log(allUsers);
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  editAdmin: async (req, res) => {
    try {
      let { email, first_name, last_name, role, warehouseName } = req.body;

      if (!email || !first_name || !last_name || !role)
        return res.status(404).send({
          isError: true,
          message: "Please Complete Registration Data",
          data: null,
        });

      let dataToSend = await db.user.update(
        {
          first_name,
          last_name,
          role,
        },
        {
          where: {
            email,
          },
        }
      );

      let findEmail = await db.user.findOne({
        where: {
          email: email,
        },
      });

      if (role === "wh_admin") {
        let findWarehouse = await db.warehouse.findOne({
          where: {
            name: warehouseName,
          },
        });

        let checkWarehouseAdmin = await db.wh_admin.findOne({
          where: {
            user_id: findEmail.dataValues.id,
          },
        });

        if (checkWarehouseAdmin) {
          let warehouseAdminSend = await db.wh_admin.update(
            {
              warehouse_id: findWarehouse.dataValues.id,
            },
            {
              where: {
                user_id: findEmail.dataValues.id,
              },
            }
          );
        } else {
          let warehouseAdminAdd = await db.wh_admin.create({
            warehouse_id: findWarehouse.dataValues.id,
            user_id: findEmail.dataValues.id,
          });
        }
      } else {
        let checkWarehouseAdmin = await db.wh_admin.findOne({
          where: {
            user_id: findEmail.dataValues.id,
          },
        });

        if (checkWarehouseAdmin) {
          let warehouseAdminSend = await db.wh_admin.destroy({
            where: {
              user_id: findEmail.dataValues.id,
            },
          });
        }
      }

      res.status(201).send({
        isError: false,
        message: "Edit Profile Success",
        data: null,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: "Edit Profile Failed",
        data: error,
      });
    }
  },

  deleteWHAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const warehouseAdmin = await db.wh_admin.findByPk(id);
      if (!warehouseAdmin) {
        return res.status(404).send({
          isError: true,
          message: "Warehouse admin not found",
          data: null,
        });
      }
      await warehouseAdmin.destroy();
      return res.status(200).send({
        isError: false,
        message: "Warehouse admin deleted successfully",
        data: null,
      });
    } catch (error) {
      return res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  deleteAdminData: async (req, res) => {
    try {
      let { email } = req.query;

      let findEmail = await db.user.findOne({
        where: {
          email,
        },
      });

      if (findEmail.dataValues.role === "wh_admin") {
        let deleteWarehouseAdmin = await db.wh_admin.destroy({
          where: {
            user_id: findEmail.dataValues.id,
          },
        });
      }

      let deleteAdminData = await db.user.destroy({
        where: {
          email,
        },
      });

      res.status(201).send({
        isError: false,
        message: "Delete Profile Success",
        data: null,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: "Delete Profile Failed",
        data: error,
      });
    }
  },

  adminAllStats: async (req, res) => {
    try {
      let { dateNow, dateLastMonth, dateLastTwoMonth, warehouseId } = req.query;

      dateNow = new Date(dateNow);
      dateNow = dateNow.toISOString().slice(0, 10);

      dateLastMonth = new Date(dateLastMonth);
      dateLastMonth = dateLastMonth.toISOString().slice(0, 10);

      dateLastTwoMonth = new Date(dateLastTwoMonth);
      dateLastTwoMonth = dateLastTwoMonth.toISOString().slice(0, 10);

      if (warehouseId === "") {
        let findOrderThisMonth = await db.order.findAll({
          where: {
            createdAt: {
              [Sequelize.Op.between]: [dateLastMonth, dateNow],
            },
          },
        });

        let findOrderLastMonth = await db.order.findAll({
          where: {
            createdAt: {
              [Sequelize.Op.between]: [dateLastTwoMonth, dateLastMonth],
            },
          },
        });

        let findOrderDetailThisMonth = await db.order_detail.findAll({
          include: [
            {
              model: db.product,
            },
          ],
          where: {
            createdAt: {
              [Sequelize.Op.between]: [dateLastMonth, dateNow],
            },
          },
        });

        let findOrderDetailLastMonth = await db.order_detail.findAll({
          include: [
            {
              model: db.product,
            },
          ],
          where: {
            createdAt: {
              [Sequelize.Op.between]: [dateLastTwoMonth, dateLastMonth],
            },
          },
        });

        res.status(201).send({
          isError: false,
          message: "Get Order",
          data: {
            findOrderThisMonth,
            findOrderLastMonth,
            findOrderDetailThisMonth,
            findOrderDetailLastMonth,
          },
        });
      } else {
        let findOrderThisMonth = await db.order.findAll({
          where: {
            createdAt: {
              [Sequelize.Op.between]: [dateLastMonth, dateNow],
            },
            warehouse_id: warehouseId,
          },
        });

        let findOrderLastMonth = await db.order.findAll({
          where: {
            createdAt: {
              [Sequelize.Op.between]: [dateLastTwoMonth, dateLastMonth],
            },
            warehouse_id: warehouseId,
          },
        });

        let findOrderDetailThisMonth = await db.order_detail.findAll({
          include: [
            {
              model: db.product,
            },
            {
              model: db.order,
              where: {
                warehouse_id: warehouseId,
              },
            },
          ],
          where: {
            createdAt: {
              [Sequelize.Op.between]: [dateLastMonth, dateNow],
            },
          },
        });

        let findOrderDetailLastMonth = await db.order_detail.findAll({
          include: [
            {
              model: db.product,
            },
            {
              model: db.order,
              where: {
                warehouse_id: warehouseId,
              },
            },
          ],
          where: {
            createdAt: {
              [Sequelize.Op.between]: [dateLastTwoMonth, dateLastMonth],
            },
          },
        });

        res.status(201).send({
          isError: false,
          message: "Get Order",
          data: {
            findOrderThisMonth,
            findOrderLastMonth,
            findOrderDetailThisMonth,
            findOrderDetailLastMonth,
          },
        });
      }
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  adminType: async (req, res) => {
    try {
      let { token } = req.query;

      const validateTokenResult = validateToken(token);
      let adminData = await db.user.findOne({
        where: { id: validateTokenResult.id },
      });

      res.status(200).send({
        isError: false,
        message: "Get Admin Type",
        data: {
          adminData,
        },
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  localAdmin: async (req, res) => {
    try {
      let { id } = req.query;
      let localAdmin = await db.wh_admin.findOne({
        include: [
          {
            model: db.warehouse,
          },
        ],
        where: {
          user_id: id,
        },
      });

      res.status(200).send({
        isError: false,
        message: "Get Admin Type",
        data: {
          localAdmin,
        },
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.uid;
      console.log("a", id);

      const user = await db.user.findOne({ where: { id } });
      if (user.role !== "admin") {
        return res.status(401).send({
          isError: true,
          message: "Unauthorized access",
          data: null,
        });
      }

      const orderId = req.params.orderId;
      const newStatusId = 4;
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
      const { id } = req.uid;

      const user = await db.user.findOne({ where: { id } });
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

  productStockByWarehouse: async (req, res) => {
    try {
      const { id } = req.uid;
      const { Op } = require("sequelize");
      const { warehouseId } = req.query;

      const user = await db.user.findOne({ where: { id } });
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

  fetchWarehouses: async (req, res) => {
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
      const { id } = req.uid;
      const { Op } = require("sequelize");
      const { month, year, warehouse_id } = req.query;
      const moment = require("moment");

      const user = await db.user.findOne({ where: { id } });
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
      const { id } = req.uid;
      const { Op } = require("sequelize");
      const { product_id, warehouse_id, month, year } = req.query;
      const moment = require("moment");

      const user = await db.user.findOne({ where: { id } });
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
