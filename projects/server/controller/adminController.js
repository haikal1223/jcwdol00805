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

  addProductCategory: async (req, res, next) => {
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
        message: "Error in adding category",
        data: null,
      });
    }
  },

  editProductCategory: async (req, res) => {
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
      const { category_name } = req.body;
      const { id } = req.params;
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
      const category = await db.product_category.findOne({ where: { id } });
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
      const { uid } = req.uid;

      const user = await db.user.findOne({ where: { uid } });
      if (user.role !== "admin") {
        return res.status(401).send({
          isError: true,
          message: "Unauthorized access",
          data: null,
        });
      }
      const { id } = req.params;
      const category = await db.product_category.findOne({ where: { id } });
      if (!category) {
        res.status(404).send({
          isError: true,
          message: "No Product Category Founded.",
          data: null,
        });
      }

      await category.destroy();
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
};
