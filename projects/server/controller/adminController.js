// Import Models
const db = require("../sequelize/models/index");

// Import Hashing
const { matchPassword, hashPassword } = require("../lib/hash");

// Import jwt
const { createToken } = require("../lib/jwt");
const { Sequelize } = require("../sequelize/models/index");

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
  adminData: async (req, res) => {
    try {
      let { offset, row } = req.query;
      let findAdmin = await db.user.findAll({
        where: {
          [Sequelize.Op.or]: [{ role: "admin" }, { role: "wh_admin" }],
        },
        limit: parseInt(row),
        offset: parseInt(offset),
      });
      let findAdminAll = await db.user.findAll({
        where: {
          [Sequelize.Op.or]: [{ role: "admin" }, { role: "wh_admin" }],
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

  userData: async (req, res) => {
    try {
      let { offset, row } = req.query;
      let findUser = await db.user.findAll({
        where: { role: "user" },
        limit: parseInt(row),
        offset: parseInt(offset),
      });

      let findUserAll = await db.user.findAll({
        where: { role: "user" },
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
      let { email, first_name, last_name, role, password } = req.body;

      if (!email || !first_name || !last_name || !role || !password)
        return res.status(404).send({
          isError: true,
          message: "Please Complete Registration Data",
          data: null,
        });

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
      let { email, first_name, last_name, role } = req.body;

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
