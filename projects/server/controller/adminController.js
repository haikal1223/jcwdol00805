const { sequelize } = require("../sequelize/models");

// Import Models
const db = require("../sequelize/models/index");

// Import Hashing
const { matchPassword } = require("../lib/hash");

// Import jwt
const { createToken, validateToken } = require("../lib/jwt");

module.exports = {
    login: async (req, res) => {
        try {
            let { email, password } = req.query;

            if (!email || !password)
                return res.status(404).send({
                    iserror: true,
                    message: 'Email or password is empty',
                    data: null
                })

            let findEmail = await db.user.findOne({
                where: { email: email },
            });

            if (!findEmail) {
                return res.status(401).send({
                    iserror: true,
                    message: "Email not found",
                    data: null,
                })
            } else if (findEmail.dataValues.role === "user") {
                return res.status(401).send({
                    isError: true,
                    message: "Unauthorized access",
                    data: null
                })
            } else {
                let matchPasswordResult = await matchPassword(
                    password, findEmail.dataValues.password
                );

                if (matchPasswordResult === false)
                    return res.status(401).send({
                        isError: true,
                        message: "Incorrect password",
                        data: null,
                    });

                res.status(200).send({
                    isError: false,
                    message: "Login Success",
                    data: {
                        token: createToken({id: findEmail.dataValues.id}),
                        email: findEmail.dataValues.email,
                        role: findEmail.dataValues.role
                    },
                });
            }
        } catch (error) {
            res.status(500).send({
                isError: true,
                message: error.message,
                data: true,
            });
        }
    },

    verifyToken: async (req, res) => {
        try {
          let { token } = req.query;

          if (!token) {
            return res.status(401).send({
              isError: true,
              message: "Token not found",
              data: null,
            });
          }

          const validateTokenResult = validateToken(token);
          return res.status(200).send({
            isError: false,
            message: 'Token is found',
            data: validateTokenResult
          })

        } catch (error) {
          res.status(401).send({
            isError: true,
            message: "Invalid Token",
            data: null,
          });
        }
    },

    fetchWarehouse : async(req, res) => {
        try {
            // get value
            let { id } = req.query

            // fetch wh_id
            let get_whid = await sequelize.query(
                `SELECT CASE 
                WHEN a.role='admin' THEN 'all'
                WHEN a.role='wh_admin' THEN warehouse_id
                END AS wh_id
                FROM wh_admin 
                RIGHT JOIN users a
                ON a.id = wh_admin.user_id
                WHERE a.id='${id}'`
            )

            // send response
            res.status(200).send({
                isError: false,
                message: 'wh_id admin fetched',
                data: get_whid
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