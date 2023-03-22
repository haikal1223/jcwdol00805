const { sequelize } = require("../sequelize/models");
const db = require('../connection/conn')
const util = require('util')
const query = util.promisify(db.query).bind(db)

module.exports = {
    login: async (req, res) => {
        try {
            
        } catch (error) {
            
        }
    }
}