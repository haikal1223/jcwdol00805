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
      let { offset, row, name, category_id, sort, sortMode } = req.query;

      let column = "id";
      switch (sort) {
        case "sortId":
          column = "id";
          break;
        case "sortProductName":
          column = "name";
          break;
        case "sortPrice":
          column = "price";
          break;
      }

      let findProduct = await db.product.findAll({
        include: [
          {
            model: db.product_category,
          },
        ],

        where: {
          name: { [db.Sequelize.Op.like]: `%${name}%` },
        },
        order: [[column, sortMode]],
        limit: parseInt(row),
        offset: parseInt(offset),
      });

      let findProductAll = await db.product.findAll({
        include: [
          {
            model: db.product_category,
          },
        ],

        where: {
          name: { [db.Sequelize.Op.like]: `%${name}%` },
        },
      });

      if (category_id) {
        findProduct = await db.product.findAll({
          include: [
            {
              model: db.product_category,
            },
          ],

          where: {
            name: { [db.Sequelize.Op.like]: `%${name}%` },
            product_category_id: category_id,
          },
          order: [[column, sortMode]],
          limit: parseInt(row),
          offset: parseInt(offset),
        });

        findProductAll = await db.product.findAll({
          include: [
            {
              model: db.product_category,
            },
          ],

          where: {
            name: { [db.Sequelize.Op.like]: `%${name}%` },
            product_category_id: category_id,
          },
        });
      }

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

  fetchProductCategory: async (req, res) => {
    try {
      let findCategory = await db.product_category.findAll({});

      res.status(200).send({
        isError: false,
        message: "Get Product Category Data Success",
        data: findCategory,
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: true,
      });
    }
  },

  deleteProductData: async (req, res) => {
    try {
      let { id } = req.query;

      let findProduct = await db.product.findOne({
        where: {
          id,
        },
      });

      let deleteProductData = await db.product.destroy({
        where: {
          id,
        },
      });

      res.status(201).send({
        isError: false,
        message: "Delete Product Success",
        data: null,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: "Delete Product Failed",
        data: error,
      });
    }
  },

  addProduct: async (req, res) => {
    try {
      let { name, price, product_category_id, image_url } = req.body;

      if (!name || !price || !product_category_id || !image_url)
        return res.status(404).send({
          isError: true,
          message: "Please Complete Product Data",
          data: null,
        });

      let findProduct = await db.product.findOne({
        where: {
          name,
        },
      });

      if (findProduct)
        return res.status(404).send({
          isError: true,
          message: "Product already exist",
          data: null,
        });

      let dataToSend = await db.product.create({
        name,
        price,
        product_category_id,
        image_url,
      });

      res.status(201).send({
        isError: false,
        message: "Add Product Success",
        data: null,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: "Add Product Failed",
        data: error,
      });
    }
  },

  editProduct: async (req, res) => {
    try {
      let { id, name, price, product_category_id, image_url } = req.body;

      if (!name || !price || !product_category_id || !image_url)
        return res.status(404).send({
          isError: true,
          message: "Please Complete Product Data",
          data: null,
        });

      let findProduct = await db.product.findOne({
        where: {
          id,
        },
      });

      let dataToSend = await db.product.update(
        {
          name,
          price,
          product_category_id,
          image_url,
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(201).send({
        isError: false,
        message: "Edit Product Success",
        data: req.body,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: "Edit Product Failed",
        data: error,
      });
    }
  },
};
