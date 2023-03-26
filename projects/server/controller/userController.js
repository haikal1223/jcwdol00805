const { sequelize } = require("../sequelize/models");
const jwt = require("jsonwebtoken");

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

const bcrypt = require("bcrypt");
const { validateToken } = require("../lib/jwt");

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
        },
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
        is_verified: 0,
        role: "user",
      });

      const template = await fs.readFile("./template/template.html", "utf-8");

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
        message: "Registration Success, Please check your E-mail",
        data: null,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: "Registration Failed",
        data: error,
      });
      console.log(error);
    }
  },

  getData: async (req, res) => {
    let { uid } = req.query;
    const findUsers = await db.user.findAll({
      where: {
        uid,
      },
    });
    if (findUsers)
      return res.status(200).send({
        isError: false,
        message: "Data is found",
        data: findUsers,
      });
  },

  inputPassword: async (req, res) => {
    try {
      let { password } = req.body;
      const hashedPassword = await hashPassword(password);

      const updatePassword = await db.user.update(
        {
          password: hashedPassword,
          is_verified: 1,
          profile_photo: "Public\\images\\default.svg",
        },
        {
          where: {
            uid: req.params.uid,
          },
        }
      );

      res.status(201).send({
        isError: false,
        message: "Your account is verified!",
        data: null,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: "Something Error",
        data: null,
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      let { email } = req.body;

      if (!email)
        return res.status(404).send({
          isError: true,
          message: "Please input your email",
          data: null,
        });

      let findEmail = await db.user.findOne({
        where: {
          email: email,
        },
      });

      if (!findEmail)
        return res.status(404).send({
          isError: true,
          message: "Email not found",
          data: null,
        });

      const updatedData = await db.user.update(
        { is_Updated: 0 },
        {
          where: {
            email: email,
          },
        }
      );

      const first_name = findEmail.dataValues.first_name;

      const template = await fs.readFile(
        "./template/resetPassword.html",
        "utf-8"
      );

      const templateComplier = await handlebars.compile(template);
      const newTemplate = templateComplier({
        first_name,
        url: `http://localhost:3000/updatePassword/${findEmail.dataValues.uid}`,
      });

      await transporter.sendMail({
        from: "IKEANYE",
        to: email,
        subject: "Reset Password",
        html: newTemplate,
      });

      res.status(201).send({
        isError: false,
        message: "Check Your Email",
        data: null,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      let { uid, password, confPassword } = req.body;
      if (!password)
        return res.status(404).send({
          isError: true,
          message: "Please Input Your Password",
          data: null,
        });

      if (password !== confPassword)
        return res.status(404).send({
          isError: true,
          message: "Password Not Match",
          data: password,
          confPassword,
        });

      let findEmail = await db.user.findOne({
        where: {
          uid: uid,
        },
      });

      if (findEmail.dataValues.is_Updated === 1)
        throw { message: "Link Expired after updated data" };

      await db.user.update(
        { password: await hashPassword(password), is_Updated: 1 },
        {
          where: {
            uid: uid,
          },
        }
      );

      res.status(201).send({
        isError: false,
        message: "Update Password Success",
        data: null,
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  login: async (req, res) => {
    try {
      let { email, password } = req.query;

      if (!email || !password)
        return res.status(404).send({
          iserror: true,
          message: "Email or password is empty",
          data: null,
        });
      let findEmail = await db.user.findOne({
        where: { email: email },
      });
      if (!findEmail) {
        res.status(404).send({
          iserror: true,
          message: "Email is not found",
          data: null,
        });
      } else {
        let matchPasswordResult = await matchPassword(
          password,
          findEmail.dataValues.password
        );

        if (matchPasswordResult === false)
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
  verifytoken: (req, res) => {
    let { token } = req.query;

    if (!token) {
      return res.status(401).send({
        isError: true,
        message: "Token not found",
        data: null,
      });
    }

    try {
      const validateTokenResult = validateToken(token);
      res.status(200).send({
        isError: true,
        message: "Token is valid",
        data: validateTokenResult,
      });
    } catch (error) {
      res.status(401).send({
        isError: true,
        message: "Invalid Token",
        data: null,
      });
    }
  },
};
