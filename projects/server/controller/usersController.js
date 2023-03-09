
const { sequelize } = require('../models')
const { Op } = require('sequelize');
const bcrypt = require('bcrypt')


const db = require('../models/index')
const user = db.user

const { hashPassword, hashMatch } = require('./../lib/hash')

const { createToken } = require('./../lib/jwt')

module.exports = {

    registerUser: async (req, res) => {
        try {
            let { first_name, last_name, email } = req.body;

            if (!first_name || !last_name || !email)
                return res.status(404).send({
                    isError: true,
                    message: "Please Complete Registration Data",
                    data: null,
                });

            let findEmail = await db.user.findOne({
                where: {
                    email: email,
                }
            });

            if (findEmail)
                return res.status(404).send({
                    isError: true,
                    message: "Email already exist",
                    data: null,
                });

            let dataToSend = await db.user.create({
                first_name,
                last_name,
                email,
            });

            const template = await fs.readFile(
                "./template/template.html",
                "utf-8"
            );

            const templateComplier = await handlebars.compile(template);
            const newTemp = templateComplier({
                first_name,
                url: `http://localhost:3000/activation?uid=${dataToSend.dataValues.uid}`,
            });

            await transporter.sendMail({
                from: "IKEANYE",
                to: email,
                subject: "Activation Account",
                html: newTemp,
            });

            res.status(201).send({
                isError: false,
                message: 'Registration Success, Please check your E-mail',
                data: null,
            });

        } catch (error) {
            res.status(404).send({
                isError: true,
                message: "Registration Failed",
                data: error
            });
            console.log(error);
        }

    },


    login: async (req, res) => {
        try {
            let { email, password } = req.query;

            let findEmail = await db.user.findOne({
                where: { email: email }
            })

            let hasMatchResult = await hashMatch(password, findEmail.dataValues.password)

            if (hasMatchResult === false)
                return
            res.status(404).send({
                isError: true,
                message: 'Data not valid',
                data: true
            })

            let token = createToken({
                uid: findEmail.dataValues.uid
            })
            res.status(200).send({
                isError: false,
                message: 'Login Success',
                data: { token, email: findEmail.dataValues.email }
            })
            if (!email || !password)
                return res.status(404).send({
                    iserror: true,
                    message: 'Login Failed',
                    data: null
                })


        } catch (error) {
            // console.log(error)
            res.status(500).send({
                isError: true,
                message: error.message,
                data: true
            })
        }
    }
}