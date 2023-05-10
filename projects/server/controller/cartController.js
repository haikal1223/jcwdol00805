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
const order = require("../sequelize/models/order");

module.exports = {
  getCartFilterProduct: async (req, res) => {
    try {
      let { user_id, product_id } = req.query;
      const findCart = await db.cart.findAll({
        where: {
          user_id,
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
      const { user_id } = req.query;

      const findUserCart = await db.cart.findAll({
        where: {
          user_id,
        },
        include: [
          {
            model: db.product,
            attributes: ["name", "price", "product_category_id", "image_url"],
            include: [
              {
                model: db.product_stock,
                include: [
                  {
                    model: db.warehouse,
                    attributes: ["city"],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!findUserCart) {
        return res.status(404).send({
          isError: true,
          message: "Cart is empty",
          data: null,
        });
      }

      return res.status(200).send({
        isError: false,
        message: "Cart items fetched successfully",
        data: findUserCart,
      });
    } catch (error) {
      // Send error response to the client
      return res.status(500).send({
        isError: true,
        message: "Internal server error",
        data: null,
      });
    }
  },
  
   /* getUserCartx: async (req, res) => {
    try {
      const { uid } = req.uid;

      // Validate uid parameter
      if (!uid) {
        return res.status(400).send({
          isError: true,
          message: "Invalid user ID",
          data: null,
        });
      }

      const { id } = await db.user.findOne({
        where: {
          uid,
        },
      });

      const findUserCart = await db.cart.findAll({
        where: {
          user_id: id,
        },
        include: [
          {
            model: db.product,
            attributes: ["name", "price", "product_category_id", "image_url"],
            include: [
              {
                model: db.product_stock,
                include: [
                  {
                    model: db.warehouse,
                    attributes: ["city"],
                  },
                ],
              },
            ],
          },
        ],
      });

      return res.status(200).send({
        isError: false,
        message: "Cart items fetched successfully",
        data: findUserCart,
      });
    } catch (error) {
      // Send error response to the client
      return res.status(500).send({
        isError: true,
        message: "Internal server error",
        data: null,
      });
    }
  }, */

  getUserCartx: async (req, res) => {
    try {
      const { id } = req.uid;

      // Validate uid parameter
      // if (!uid) {
      //   return res.status(400).send({
      //     isError: true,
      //     message: "Invalid user ID",
      //     data: null,
      //   });
      // }
      console.log("test", id);

      // const { id } = await db.user.findOne({
      //   where: {
      //     uid,
      //   },
      // });

      const findUserCart = await db.cart.findAll({
        where: {
          user_id: id,
        },
        include: [
          {
            model: db.product,
            attributes: ["name", "price", "product_category_id", "image_url"],
            include: [
              {
                model: db.product_stock,
                include: [
                  {
                    model: db.warehouse,
                    attributes: ["city"],
                  },
                ],
              },
            ],
          },
        ],
      });

      return res.status(200).send({
        isError: false,
        message: "Cart items fetched successfully",
        data: findUserCart,
      });
    } catch (error) {
      // Send error response to the client
      return res.status(500).send({
        isError: true,
        message: "Internal server error",
        data: null,
      });
    }
  },

  addCartProduct: async (req, res) => {
    try {
      let { quantity, price, user_id, product_id } = req.body;
      let dataToSend = await db.cart.create({
        quantity,
        price,
        user_id,
        product_id,
      });

      res.status(201).send({
        isError: false,
        message: "Your product is add to cart",
        data: null,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: "Something Error",
        data: error,
      });
    }
  },

  updateCartProduct: async (req, res) => {
    try {
      let { user_id, product_id } = req.query;
      let { quantity, price } = req.body;
      let dataToSend = await db.cart.update(
        {
          quantity,
          price,
        },
        {
          where: {
            user_id,
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
    const { id } = req.uid;
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
      // const { id } = await db.user.findOne({ where: { uid } });
      console.log("id", id);
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
    const { id } = req.uid;

    try {
      // const { id } = await db.user.findOne({
      //   where: { uid: uid },
      // });

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
        { headers: { key: "38cc0e5fdc569640ad614c40fcf5432c" } }
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
          headers: { key: "38cc0e5fdc569640ad614c40fcf5432c" },
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

  sendDataToOrder: async (req, res) => {
    try {
      t = await sequelize.transaction();
      const { uid } = req.uid;
      const {
        paid_amount,
        user_address_id,
        shipping_cost,
        warehouse_id,
        order_status_id,
      } = req.body;
      if (!uid) {
        return res.status(400).send({
          isError: true,
          message: "Invalid user ID",
          data: null,
        });
      }

      const { id: user_id } = await db.user.findOne({
        where: {
          uid,
        },
      });

      const cartItems = await db.cart.findAll({
        where: {
          user_id,
          is_checked: 1,
        },
      });
      console.log(cartItems);

      const order_status = await db.order_status.create({
        id: order_status_id,
        status: "Pending",
      });

      const order = await db.order.create(
        {
          user_id,
          user_address_id,
          paid_amount,
          shipping_cost,
          warehouse_id,
          payment_proof: "Pending",
          order_status_id: order_status.id,
          carts: cartItems, // include the associated cart items
        },
        { transaction: t }
      );

      const t2 = await sequelize.transaction();
      await db.cart.destroy({
        where: {
          user_id,
          is_checked: 1,
        },
        transaction: t2,
      });
      await t2.commit();

      const orderDetailsArray = [];

      for (const cart of cartItems) {
        const order_details = await db.order_detail.create(
          {
            product_price: cart.price,
            product_quantity: cart.quantity,
            subtotal: cart.price * cart.quantity,
            order_id: order.id,
            product_id: cart.product_id,
          },
          { transaction: t }
        );

        orderDetailsArray.push(order_details);
      }

      await t.commit();

      res.status(200).send({
        isError: false,
        message: "Order created successfully",
        data: order,
        order_status,
        orderDetailsArray,
      });
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      res.status(500).send({
        isError: true,
        message: "An error occurred while processing your request",
        data: null,
      });
    }},
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
  
  getStockOrigin: async (req, res) => {
    const { id } = req.uid;
    try {
      const user = await db.user.findOne({
        where: { id: id },
        include: [
          {
            model: db.cart,
            include: [
              {
                model: db.product,
                include: [
                  {
                    model: db.product_stock,
                    include: [
                      {
                        model: db.warehouse,
                        attributes: ["city"],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      const cart = user.carts.map((cart) => {
        return {
          quantity: cart.quantity,
          price: cart.price,
          product: {
            name: cart.product.name,
            price: cart.product.price,
            image_url: cart.product.image_url,
            stock: cart.product.product_stocks[0].stock,
            warehouse_city: cart.product.product_stocks[0].warehouse.city,
          },
        };
      });
      res.send({ cart });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: error,
      });
    }
  },
};
