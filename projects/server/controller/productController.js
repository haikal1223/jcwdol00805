const { sequelize } = require("../sequelize/models");
const db = require('../connection/conn')
const util = require('util')
const query = util.promisify(db.query).bind(db)

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
    }
}