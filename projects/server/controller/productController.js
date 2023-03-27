const { sequelize } = require("../sequelize/models");
// const db = require('../connection/conn')
const util = require('util')
// const query = util.promisify(db.query).bind(db)


const { Op } = require('sequelize');
const db = require('../sequelize/models')
const axios = require('axios')

module.exports = {
    viewProduct: async (req, res) => {
        try {
            // get value


            // run query
            let products = await sequelize.query(`SELECT * FROM product ORDER BY RAND()`)

            // response
            res.status(201).send({
                isError: false,
                message: 'Product list returned',
                data: products
            })

        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
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

}