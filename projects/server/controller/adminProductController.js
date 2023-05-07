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
            let { row, offset } = req.query

            // run query
            let detail = await sequelize.query(
                `SELECT a.*, c.category_name
                FROM product a
                LEFT JOIN product_category c
                ON a.product_category_id = c.id
                WHERE a.id = ${id}`
            )
            
            let stock = await sequelize.query(
                `SELECT b.id, b.name, b.city, a.stock
                FROM product_stock a
                LEFT JOIN warehouse b
                ON a.warehouse_id = b.id
                WHERE a.product_id = ${id}`
            )

            let log = await sequelize.query(
                `SELECT a.*, b.email, b.role, c.name
                FROM stock_log a
                LEFT JOIN users b
                ON a.user_id = b.id
                LEFT JOIN warehouse c
                ON a.warehouse_id = c.id
                WHERE a.product_id = ${id}
                ORDER BY createdAt DESC LIMIT ${row} OFFSET ${offset}`
            )

            let countLog = await sequelize.query(
                `SELECT count(id) as num_log FROM stock_log
                WHERE product_id = ${id}`
            )

            // response
            res.status(201).send({
                isError: false,
                message: 'product detail fetched',
                data: {
                    detail,
                    stock,
                    log,
                    countLog
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
                user_id: uid
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
    },

    fetchWarehouse: async(req, res) => {
        try {
            // fetch product id
            let { id } = req.params
            let { whid } = req.query

            let whLimit = ''
            if (whid != 'all') {
                whLimit = ` AND id = ${parseInt(whid)}`
            }

            // run query
            let warehouses = await sequelize.query(
                `SELECT id, name from warehouse
                WHERE id NOT IN (
                    SELECT warehouse_id FROM product_stock
                    WHERE product_id = ${id}
                )${whLimit}`
            )
            
            // response
            res.status(201).send({
                isError: false,
                message: 'Available warehouse fetched',
                data: warehouses
            })

        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },

    addStock: async(req, res) => {
        try {
            // fetch product id, wh id, stock
            let { id } = req.params
            let { whid, stock, uid } = req.body

            // verify if wh available
            let verifyWh = await db.product_stock.findOne({
                where: {
                    product_id: parseInt(id),
                    warehouse_id: whid,
                }
            })

            // if wh already exist
            if(verifyWh) {
                return res.status(500).send({
                    isError: true,
                    message: 'stock for this warehouse already exist',
                    data: null
                })
            } else {
                // run query
                await db.product_stock.create({
                    product_id: parseInt(id),
                    warehouse_id: whid,
                    stock: stock
                })

                await db.stock_log.create({
                    product_id: parseInt(id),
                    warehouse_id: whid,
                    old_stock: 0,
                    new_stock: stock,
                    operation: 'edit',
                    user_id: uid
                }) 
            }

            // response
            res.status(201).send({
                isError: false,
                message: 'Stock added',
                data: true
            })

        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },

    deleteStock: async(req, res) => {
        try {
            // fetch product id & wh id
            let { id } = req.params
            let { wh, stock, uid } = req.query

            // run query
            await db.product_stock.destroy({
                where : {
                    product_id: parseInt(id),
                    warehouse_id: parseInt(wh)
                }
            })

            await db.stock_log.create({
                product_id: parseInt(id),
                warehouse_id: wh,
                old_stock: stock,
                new_stock: 0,
                operation: 'edit',
                user_id: uid
            }) 

            // response
            res.status(201).send({
                isError: false,
                message: 'Stock deleted',
                data: true
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