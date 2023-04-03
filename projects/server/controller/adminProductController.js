const { sequelize } = require("../sequelize/models");
// Import Models
const db = require("../sequelize/models/index");

// Import Hashing
const { hashPassword, matchPassword } = require("../lib/hash");

// Import jwt
const { createToken, validateToken } = require("../lib/jwt");

// Import multer
const { uploader } = require("../lib/multer");

// Import Filesystem
const fs = require("fs").promises;

// Import Transporter
const transporter = require("../helper/transporter");

// Import handlebars
const handlebars = require("handlebars");
const { kStringMaxLength } = require("buffer");

const bcrypt = require("bcrypt");

module.exports = {
    fetchDetail: async(req, res) => {
        try {
            // fetch product id
            let { id } = req.params

            // run query
            let detail = await sequelize.query(
                `SELECT a.*, c.category_name
                FROM product a
                LEFT JOIN product_category c
                ON a.product_category_id = c.id
                WHERE a.id = ${id}`
            )
            
            let stock = await sequelize.query(
                `SELECT b.name, a.stock
                FROM product_stock a
                LEFT JOIN warehouse b
                ON a.warehouse_id = b.id
                WHERE a.product_id = ${id}`
            )

            let log = await sequelize.query(
                `SELECT a.*, b.email, b.role, c.name
                FROM stock_log a
                LEFT JOIN users b
                ON a.user_uid = b.uid
                LEFT JOIN warehouse c
                ON a.warehouse_id = c.id
                WHERE a.product_id = ${id}
                ORDER BY createdAt DESC`
            )

            // response
            res.status(201).send({
                isError: false,
                message: 'product detail fetched',
                data: {
                    detail,
                    stock,
                    log
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

    editStock: async(req, res) => {
        try {
            // fetch product id & wh id
            let { id } = req.params
            let { whid, oldStock, newStock, uid } = req.body

            // run query
            await db.product_stock.update({stock : parseInt(newStock)}, {
                where: {
                    product_id: id,
                    warehouse_id: whid
                }
            })

            let log = await db.stock_log.create({
                product_id: id,
                warehouse_id: whid,
                old_stock: oldStock,
                new_stock: newStock,
                operation: 'edit',
                user_uid: uid
            }) 

            // response
            res.status(201).send({
                isError: false,
                message: 'Stock updated',
                data: log
            })


        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    }
}