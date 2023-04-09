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
    viewMutation: async(req, res) =>{
        try {
            // get value
            let { id, wh, status, sort, offset, row } = req.query

            let searchClause = ''
            let filterWhClause = ''
            let filterStatusClause = ''
            if(id !== '') {
                searchClause = `AND a.id = ${parseInt(id)}`
            }
            if(wh !== '') {
                filterWhClause = `AND a.origin_wh_id = ${parseInt(wh)}`
            }
            if(status !== '') {
                filterStatusClause = `AND a.mutation_status_id = ${parseInt(status)}`
            }

            // run query
            let data = await sequelize.query(
                `SELECT a.*
                , b.name as origin_wh_name
                , c.name as target_wh_name
                , d.status
                , CASE WHEN a.order_id IS NOT NULL THEN 'buyer' ELSE e.email END as requester
                , f.email as reviewer
                , g.stock as current_origin_stock
                , CASE WHEN h.stock IS NULL THEN 0 ELSE h.stock END as current_target_stock
                FROM stock_mutation a
                LEFT JOIN warehouse b
                ON a.origin_wh_id = b.id
                LEFT JOIN warehouse c
                on a.target_wh_id = c.id
                LEFT JOIN mutation_status d
                ON a.mutation_status_id = d.id
                LEFT JOIN users e
                ON a.requester_id = e.id
                LEFT JOIN users f
                ON a.reviewer_id = f.id
                LEFT JOIN product_stock g
                ON a.origin_wh_id = g.warehouse_id AND a.product_id = g.product_id
                LEFT JOIN product_stock h
                ON a.target_wh_id = h.warehouse_id AND a.product_id = h.product_id
                WHERE a.id IS NOT NULL
                ${searchClause} ${filterWhClause} ${filterStatusClause} ${sort}`
            )
            
            let numMutation = [...data[0]].length
            let mutation = [...data[0]].slice(offset, offset + row)

            // response
            res.status(201).send({
                isError: false,
                message: 'mutation list fetched',
                data: {
                    mutation,
                    numMutation
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

    fetchWarehouse: async(req, res) =>{
        try {
            // run query
            let wh = await db.warehouse.findAll({
                attributes: ['id', 'name']
            })

            // response
            res.status(201).send({
                isError: false,
                message: 'warehouse list fetched',
                data: wh
            })

        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },

    fetchStatus: async(req, res) =>{
        try {
            // run query
            let status = await db.mutation_status.findAll({
                attributes: ['id', 'status']
            })

            // response
            res.status(201).send({
                isError: false,
                message: 'mutation status fetched',
                data: status
            })

        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },

    addMutation: async(req, res) =>{
        try {
            
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },

    approveMutation: async(req, res) =>{
        try {
            
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },

    cancelMutation: async(req, res) =>{
        try {
            
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },

    rejectMutation: async(req, res) =>{
        try {
            
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    }
}