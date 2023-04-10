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
const axios = require("axios");

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

  addAddress: async (req, res) => {
    const t = await sequelize.transaction();
    const { uid } = req.uid;
    const {
      recipient_name,
      recipient_phone,
      province,
      city,
      subdistrict,
      street_address,
      main_address,
      postal_code,
    } = req.body;

    try {
      const { id } = await db.user.findOne({ where: { uid } });
      if (main_address) {
        await db.user_address.update(
          { main_address: false },
          { where: { [Op.and]: [{ main_address }, { user_id: id }] } },
          { transaction: t }
        );
      }

      await db.user_address.create(
        {
          recipient_name,
          recipient_phone,
          province,
          city,
          subdistrict,
          street_address,
          main_address,
          postal_code,
          user_id: id,
        },
        { transaction: t }
      );
      t.commit();
      res.status(201).send({
        isError: false,
        message: "Address Successfully Added",
        data: null,
      });
    } catch (error) {
      console.log(error);
      t.rollback(),
        res.status(400).send({
          isError: true,
          message: error.message,
          data: error,
        });
    }
  },

  getAddress: async (req, res) => {
    const { uid } = req.uid;
    try {
      const { id } = await db.user.findOne({
        where: { uid: uid },
      });

      const address = await db.user_address.findAll({
        where: { user_id: id },
      });

      res.status(201).send({
        isError: false,
        message: "Masuk",
        data: address,
      });
    } catch (error) {
      console.log(error);

      res.status(400).send({
        isError: true,
        message: error.message,
        data: error,
      });
    }
  },

  defaultAddress: async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction();
    try {
      await db.user_address.update(
        { main_address: false },
        { where: { main_address: true } },
        { transaction: t }
      );
      await db.user_address.update(
        { main_address: true },
        { where: { id } },
        { transaction: t }
      );
      t.commit();
      res.status(201).send({
        isError: false,
        messagae: "Main Address Selected",
        data: null,
      });
    } catch (error) {
      t.rollback();
      res.status(400).send({
        isError: true,
        message: error.message,
        data: error,
      });
    }
  },

  getProvince: async (req, res) => {
    try {
      const { data } = await axios.get(
        "https://api.rajaongkir.com/starter/province",
        { headers: { key: "98114927956fc9abdce23deeef6cfb17" } }
      );
      res.status(200).send({
        isError: false,
        message: "Rajaongkir Province",
        data: data.rajaongkir.results,
      });
    } catch (error) {
      res.status(400).send({
        isError: true,
        message: error.message,
        data: error,
      });
    }
  },

  getCity: async (req, res) => {
    const { province_id } = req.query;
    try {
      if (!province_id)
        return res.status(404).send({
          isError: true,
          message: "Province_id is not found",
          data: null,
        });
      let response = await axios.get(
        `https://api.rajaongkir.com/starter/city?province=${province_id}`,
        {
          headers: { key: "98114927956fc9abdce23deeef6cfb17" },
        }
      );

      res.status(200).send({
        isError: false,
        message: "Raja Ongkir City by Province",
        data: {
          rajaongkir: {
            country: "Indonesia",
            city: response.data.rajaongkir.results,
          },
        },
      });
    } catch (error) {
      res.status(400).send({
        isError: true,
        message: error.message,
        data: error,
      });
    }
  },

  deleteAddress: async (req, res) => {
    const { id } = req.params;
    try {
      await db.user_address.destroy({ where: { id } });
      res.status(201).send({
        isError: false,
        message: "Address deleted",
        data: null,
      });
    } catch (error) {
      res.status(400).send({
        isError: true,
        message: error.message,
        data: error,
      });
    }
  },

  getCart: async (req, res) => {
    const { uid } = req.uid;
    try {
      const { id } = await db.user.findOne({
        where: { uid: uid },
      });

      const cart = await db.cart.findAll({
        where: { user_id: id },
      });

      console.log(cart);
      res.send({ cart });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: error,
      });
    }
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
