const { sequelize } = require("../sequelize/models");

const { Op } = require("sequelize");

const { UUIDV4 } = require("sequelize");

// Import Models
const db = require("../sequelize/models/index");

// Import Hashing
const { hashPassword, matchPassword } = require("../lib/hash");

// Import jwt
const { createToken } = require("../lib/jwt");

// Import Filesystem
const fs = require("fs").promises;

// Import Transporter
const transporter = require("../helper/transporter");

// Import handlebars
const handlebars = require("handlebars");
const { kStringMaxLength } = require("buffer");

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
}
