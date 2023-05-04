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
            let { sort, search, category, row, offset } = req.query
            let searchClause = ''
            let categoryClause = ''
            if(search !== '') {
              searchClause = `AND LOWER(name) LIKE '%${search}%'`
            }
            if(category !== '') {
              categoryClause = `AND product_category_id = ${parseInt(category)}`
            }

            // run query
            let productWithStock = await sequelize.query(
              `SELECT a.*
              , CAST(COALESCE(sum(b.stock),0) AS UNSIGNED) total_stock 
              FROM product a 
              LEFT JOIN product_stock b
              ON a.id = b.product_id
              WHERE b.stock IS NOT NULL
              ${searchClause}
              ${categoryClause}
              GROUP BY 1,2,3,4,5,6,7 ${sort}`
            )
            
            let productWithoutStock = await sequelize.query(
              `SELECT a.*
              , CAST(COALESCE(sum(b.stock),0) AS UNSIGNED) total_stock 
              FROM product a 
              LEFT JOIN product_stock b
              ON a.id = b.product_id
              WHERE b.stock IS NULL
              ${searchClause}
              ${categoryClause}
              GROUP BY 1,2,3,4,5,6,7 ${sort}`
            )
            
            let products = [...productWithStock[0], ...productWithoutStock[0]].slice(parseInt(offset), parseInt(offset) + parseInt(row))
              
            let numItem = await sequelize.query(
              `SELECT COUNT(id) as num_item
              FROM product
              WHERE id IS NOT NULL
              ${searchClause}
              ${categoryClause}`
            )
            // response
            res.status(201).send({
                isError: false,
                message: 'Product list returned',
                data: {
                  products,
                  numItem
                }
            })
            
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
  },

  viewProductData: async (req, res) => {
    try {
      // get value

      // run query
      let products = await sequelize.query(
        `SELECT * FROM product`
      );

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
        let { id } = req.params;

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

      const findProductStock = await db.product_stock.findOne({
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
};
