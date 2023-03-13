require("dotenv").config()

const { sequelize } = require('../models')
const { Op } = require('sequelize');
const bcrypt = require('bcrypt')


const db = require('../models/index')
const user = db.user

const { hashPassword, hashMatch } = require('./../lib/hash')

const { createToken } = require('./../lib/jwt')



// line 140
const { geocode } = require('opencage-api-client');

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

            if (!email || !password)
                return res.status(404).send({
                    iserror: true,
                    message: 'Email or password is empty',
                    data: null
                })
            let findEmail = await db.user.findOne({
                where: { email: email }
            })

            if (!findEmail)
                return res.status(404).send({
                    iserror: true,
                    message: 'Email is not found',
                    data: null
                })

            let hasMatchResult = await hashMatch(password, findEmail.dataValues.password)

            if (hasMatchResult === false)
                return
            res.status(404).send({
                isError: true,
                message: 'Password is incorrect',
                data: true
            })

            let token = createToken({
                uid: findEmail.dataValues.uid
            })

            res.status(200).send({
                isError: false,
                message: 'Login Success',
                data: { token, email: findEmail.dataValues.email, image: findEmail.dataValues.profile_photo, name: findEmail.dataValues.first_name }
            })


        } catch (error) {
            // console.log(error)
            res.status(500).send({
                isError: true,
                message: error.message,
                data: true
            })
        }

    },
    addAddress: async (req, res) => {

        try {
            const myToken = localStorage.getItem('myToken')
            const decoded = jwt.verify(myToken, '123abc')
            const { main_address, street_address, subdistrict, city, province, recipient_name, recipient_phone, postal_code } = req.body;

            const response = await geocode({ q: `${street_address}, ${subdistrict}, ${city}, ${province}`, countrycode: 'id', limit: 1, key: process.env.API_KEY });

            const { lat, lng } = response.results[0].geometry;
            const address = await db.user_address.create({ main_address, street_address, subdistrict, city, province, recipient_name, recipient_phone, postal_code, lat, lng, user_uid: decoded });
            res.json(address);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    },


}
