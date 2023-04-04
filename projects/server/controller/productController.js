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
  viewProduct: async (req, res) => {
    try {
      // get value

      // run query
      let products = await sequelize.query(`(SELECT a.*
            , CAST(COALESCE(sum(b.stock),0) AS UNSIGNED) total_stock 
            FROM product a 
            LEFT JOIN product_stock b
            ON a.id = b.product_id
            WHERE b.stock IS NOT NULL
            GROUP BY 1,2,3,4,5,6,7 ORDER BY RAND())
            UNION
            (SELECT a.*
            , CAST(COALESCE(sum(b.stock),0) AS UNSIGNED) total_stock 
            FROM product a 
            LEFT JOIN product_stock b
            ON a.id = b.product_id
            WHERE b.stock IS NULL
            GROUP BY 1,2,3,4,5,6,7 ORDER BY RAND())
            `);

      // response
      res.status(201).send({
        isError: false,
        message: "Product list returned",
        data: products,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  viewProductData: async (req, res) => {
    try {
      // get value

      // run query
      let products = await sequelize.query(`SELECT * FROM product`);

      // response
      res.status(201).send({
        isError: false,
        message: "Product list returned",
        data: products,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  viewDetailProduct: async (req, res) => {
    try {
      // get value
      let { id } = req.query;

      const findProduct = await db.product.findAll({
        where: {
          id,
        },
      });
      if (findProduct)
        return res.status(200).send({
          isError: false,
          message: "Data is found",
          data: findProduct,
        });

      // response
      res.status(201).send({
        isError: false,
        message: "Product list returned",
        data: products,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  viewProductStock: async (req, res) => {
    try {
      // get value
      let { product_id } = req.query;

      const findProductStock = await db.product_stock.findAll({
        where: {
          product_id,
        },
      });
      if (findProductStock)
        return res.status(200).send({
          isError: false,
          message: "Data is found",
          data: findProductStock,
        });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  fetchProduct: async (req, res) => {
    try {
      let { offset, row, name } = req.query;
      // , sort, sortMode
      // let column = "id";
      // switch (sort) {
      //   case "sortId":
      //     column = "id";
      //     break;
      //   case "sortEmail":
      //     column = "email";
      //     break;
      //   case "sortFirstName":
      //     column = "first_name";
      //     break;
      //   case "sortLastName":
      //     column = "last_name";
      //     break;
      //   case "sortRole":
      //     column = "role";
      //     break;
      // }

      let findProduct = await db.product.findAll({
        // include: [
        //   {
        //     model: db.wh_admin,
        //     include: [{ model: db.warehouse }],
        //   },
        // ],

        where: {
          name: { [db.Sequelize.Op.like]: `%${name}%` } 
          
        },
        // order: [[column, sortMode]],
        limit: parseInt(row),
        offset: parseInt(offset),
      });

      let findProductAll = await db.product.findAll({
        where: {
            name: { [db.Sequelize.Op.like]: `%${name}%` } 
        },
      });

      res.status(200).send({
        isError: false,
        message: "Get Product Data Success",
        data: { findProduct, findProductAll },
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: true,
      });
    }
  },
};
