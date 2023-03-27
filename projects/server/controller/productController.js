const { sequelize } = require("../sequelize/models");
const db = require('../connection/conn')
const util = require('util')
const query = util.promisify(db.query).bind(db)

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
            `)

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
    }
}