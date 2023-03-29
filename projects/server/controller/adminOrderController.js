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
    viewOrder: async(req, res) => {
        try {
            // limit by warehouse id
            let { wh_id } = req.params

            let whereClause
            if (wh_id === 'all') {
                whereClause = ''
            } else if (parseInt(wh_id) > 0) {
                whereClause = ` WHERE warehouse_id = ${wh_id}`
            }

            // run query
            let orders = await sequelize.query(
                `SELECT a.*, b.status , c.name as wh_name , d.email as user_email, count(e.product_id) as num_item
                FROM db_warehouse.order a 
                LEFT JOIN order_status b ON a.order_status_id=b.id
                LEFT JOIN warehouse c ON a.warehouse_id = c.id
                LEFT JOIN users d ON a.user_uid = d.uid
                LEFT JOIN order_detail e ON a.id = e.order_id
                ${whereClause} GROUP BY 1,2,3,4,5,6,7,8,9,10,11,12,13 ORDER BY id DESC`
            )

            // response
            res.status(201).send({
                isError: false,
                message: 'Order list returned',
                data: orders
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