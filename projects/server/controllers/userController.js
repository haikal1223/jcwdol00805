const { sequelize } = require("sequelize");
const { UUIDV4 } = require("sequelize");
const db = require("../models/index");
const bcrypt = require("bcrypt");

module.exports = {
  getData: async (req, res) => {
    let { uid } = req.query;
    const findUsers = await db.user.findAll({
        where: {
          uid,
        },
      });
    if (findUsers)
      return res.status(200).send({
        isError: false,
        message: "Data is found",
        data: findUsers,
      });
  },

  addData: async (req, res) => {
    try {
      let { first_name, last_name, email } = req.body;

      let createUser = await db.user.create({
        first_name,
        last_name,
        email,
        role: "user",
        is_verified: 0,
      });

      res.status(201).send({
        isError: false,
        message: "Registration is success",
        data: null,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: "Something Error",
        data: null,
      });
    }
  },

  inputPassword: async (req, res) => {
    let { password } = req.body;
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updatePassword = await db.user.update(
      {
        password: hashedPassword,
        is_verified: 1
      },
      {
        where: {
          uid:req.params.uid
        }
      }
    )

  },
};
