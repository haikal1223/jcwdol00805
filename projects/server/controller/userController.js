require("dotenv").config();

const { sequelize } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

const db = require("../models/index");
const user = db.user;

const { hashPassword, hashMatch } = require("../lib/hash");

const { createToken } = require("../lib/jwt");


const { geocode } = require("opencage-api-client");

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
            let findEmail = await user.findOne({
                where: { email: email },
            });

            if (!findEmail) {
                res.status(404).send({
                    iserror: true,
                    message: "Email is not found",
                    data: null,
                });
            } else {
                let hasMatchResult = await hashMatch(
                    password,
                    findEmail.dataValues.password
                );

                if (hasMatchResult === false)
                    return res.status(404).send({
                        isError: true,
                        message: "Password is incorrect",
                        data: true,
                    });

                let token = createToken({
                    uid: findEmail.dataValues.uid,
                });

                res.status(200).send({
                    isError: false,
                    message: "Login Success",
                    data: {
                        token,
                        email: findEmail.dataValues.email,
                        image: findEmail.dataValues.profile_photo,
                        name: findEmail.dataValues.first_name,
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
};
