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
  assignWarehouseAdmin: async (req, res) => {
    try {
      const { uid } = req.uid;

      const users = await db.user.findOne({
        where: { uid: uid },
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
        data: null,
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
};
