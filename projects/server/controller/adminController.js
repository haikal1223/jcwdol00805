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
            message: 'Token is found',
            data: validateTokenResult
          })

        } catch (error) {
          res.status(401).send({
            isError: true,
            message: "Invalid Token",
            data: null,
          });
        }
    },

    fetchWarehouse : async(req, res) => {
        try {
            // get value
            let { id } = req.query

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
            )

            // send response
            res.status(200).send({
                isError: false,
                message: 'wh_id admin fetched',
                data: get_whid
            })

        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
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
      console.log(offset)
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
};
