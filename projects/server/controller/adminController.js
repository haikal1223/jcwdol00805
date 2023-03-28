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
                        token: createToken({uid: findEmail.dataValues.uid}),
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
          validateTokenResult;

        } catch (error) {
          res.status(401).send({
            isError: true,
            message: "Invalid Token",
            data: null,
          });
        }
    },

    fetchRole : async(req, res) => {
        try {
            // fetch wh_id



            // conditional if role === Admin


            // send response
            res.status(200).send({
                isError: false,
                message: 'wh_id admin fetched',
                data: null
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