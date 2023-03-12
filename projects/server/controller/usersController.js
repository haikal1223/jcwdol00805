
const { sequelize } = require('../models')
const { Op } = require('sequelize');
const bcrypt = require('bcrypt')



const db = require('../models/index')
const user = db.user

const { hashPassword, hashMatch } = require('./../lib/hash')
const { createToken } = require('./../lib/jwt')

// line 140
const UserAddress = require('../models/user_address');
const { geocode } = require('opencage-api-client');
const axios = require('axios')

const API_KEY = "b473927b6e2b48ddbdc40b75bd7c9554"

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
                data: { token, email: findEmail.dataValues.email }
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
    // line 14 sampai 18
    addAddress: async (req, res) => {
        try {
            const { main_address, street_address, subdistrict, city, province, recipient_name, recipient_phone, postal_code } = req.body;


            const response = await geocode({ q: `${street_address}, ${subdistrict}, ${city}, ${province}`, countrycode: 'id', limit: 1 });
            // ////////////////////////////////////////////////////
            /*bingung cara penggunaanya geocode baru nyoba-nyoba */
            // ////////////////////////////////////////////////////

            // const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${street_address}%2C${subdistrict}%2C${city}&key=${API_KEY}`);
            // console.log(response.data.results[0].geometry)
            const { geometry: { lat, lng } } = response.results[0];
            const address = await UserAddress.create({ main_address, street_address, subdistrict, city, province, recipient_name, recipient_phone, postal_code, lat, lng, userId: req.params.uid });
            res.json(address);
        } catch (err) {
            // console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    // Bagian Update
    updateAddress: async (req, res) => {
        try {
            const { main_address, street_address, subdistrict, city, province, recipient_name, recipient_phone, postal_code } = req.body;
            const address = await UserAddress.findOne({ where: { id: req.params.uid, userId: req.params.uid } }); // miss penulsan mungkin
            if (!address) {
                return res.status(404).json({ error: 'Address not found' });
            }
            const response = await geocode({ q: `${street_address}, ${subdistrict}, ${city}, ${province}`, countrycode: 'id', limit: 1 });
            const { geometry: { lat, lng } } = response.results[0];
            address.main_address = main_address;
            address.street_address = street_address;
            address.subdistrict = subdistrict;
            address.city = city;
            address.province = province;
            address.recipient_name = recipient_name;
            address.recipient_phone = recipient_phone;
            address.postal_code = postal_code;
            address.lat = lat;
            address.lng = lng;
            await address.save();
            res.json(address);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    // Bagian Delete
    deleteAddress: async (req, res) => {
        try {
            const address = await UserAddress.findOne({ where: { id: req.params.uid, userId: req.params.userId } }); // miss penulsan mungkin
            if (!address) {
                return res.status(404).json({ error: 'Address not found' });
            }
            await address.destroy({ where: { id: req.params.uid, userId: req.params.userId } }); // miss penulsan mungkin
            res.json({ message: 'Address deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }

    }

}