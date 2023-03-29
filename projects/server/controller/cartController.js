const { sequelize } = require("../sequelize/models");

const { Op } = require("sequelize");

const { UUIDV4 } = require("sequelize");

// Import Models
const db = require("../sequelize/models/index");

// Import Hashing
const { hashPassword, matchPassword } = require("../lib/hash");

// Import jwt
const { createToken } = require("../lib/jwt");

// Import Filesystem
const fs = require("fs").promises;

// Import Transporter
const transporter = require("../helper/transporter");

// Import handlebars
const handlebars = require("handlebars");
const { kStringMaxLength } = require("buffer");

const bcrypt = require("bcrypt");

module.exports = {
  getCartFilterProduct: async (req, res) => {
    try {
      let { user_uid, product_id } = req.query;
      const findCart = await db.cart.findAll({
        where: {
          user_uid,
          product_id,
        },
      });
      return res.status(200).send({
        isError: false,
        message: "Ok",
        data: findCart,
      });
    } catch (error) {
      console.log(error);
    }
  },

  getUserCart: async (req, res) => {
    try {
      let { user_uid, product_id } = req.query;
      const findUserCart = await db.cart.findAll({
        where: {
          user_uid,
        },
      });
      return res.status(200).send({
        isError: false,
        message: "Ok",
        data: findUserCart,
      });
    } catch (error) {
      console.log(error);
    }
  },

  addCartProduct: async (req, res) => {
    try {
      let { quantity, price, user_uid, product_id } = req.body;

      let dataToSend = await db.cart.create({
        quantity,
        price,
        user_uid,
        product_id,
      });

      res.status(201).send({
        isError: false,
        message: "Your product is add to cart",
        data: null,
      });
    } catch (error) {}
  },

  updateCartProduct: async (req, res) => {
    try {
      let { user_uid, product_id } = req.query;
      let { quantity, price } = req.body;
      let dataToSend = await db.cart.update(
        {
          quantity,
          price,
        },
        {
          where: {
            user_uid,
            product_id,
          },
        }
      );

      res.status(201).send({
        isError: false,
        message: "Your product is updated",
        data: null,
      });
    } catch (error) {}
  },

  delCart: async (req, res) => {
    try {
      let { id } = req.query;
      let deleteCart = await db.cart.destroy({
        where: {
          id,
        },
      });
      res.status(200).send({
        isError: false,
        message: "The product is delete",
        data: null,
      });
    } catch (error) {}
  },

  updateNumberProduct: async (req, res) => {
    try {
      let { id } = req.query;
      let { quantity } = req.body;
      let updateCart = await db.cart.update(
        {
          quantity,
        },
        {
          where: { id },
        }
      );
      res.status(200).send({
        isError: false,
        message: "Update cart success",
        data: null,
      });
    } catch (error) {}
  },
};
