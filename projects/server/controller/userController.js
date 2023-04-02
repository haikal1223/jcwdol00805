const { sequelize } = require("../sequelize/models");

const { Op } = require("sequelize");

const { UUIDV4 } = require("sequelize");

const HTTPStatus = require("../helper/HTTPStatus");

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

module.exports = {};

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

  getProfilePhoto: async (req, res) => {
    try {
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
    } catch (error) { }
  },

  uploadPhoto: async (req, res) => {
    try {
      let { uid } = req.query;
      const { file } = req.files;

      await db.user.update(
        {
          profile_photo: req.files.images[0].path,
        },
        {
          where: {
            uid,
          },
        }
      );
      res.status(201).send({
        isError: false,
        message: "Your profile picture is updated!",
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

  updateProfile: async (req, res) => {
    try {
      let { first_name, last_name, gender, birth_place, birth_date } = req.body;
      const updateProfile = await db.user.update(
        {
          first_name,
          last_name,
          gender,
          birth_place,
          birth_date,
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

  updatePassword: async (req, res) => {
    try {
      let { uid } = req.query;
      let {
        inputOldPassword,
        inputNewPassword,
        inputConfirmPassword,
        message,
        matchMessage,
      } = req.body;

      if (message)
        return res.status(404).send({
          isError: true,
          message: message,
          data: null,
        });
      if (matchMessage)
        return res.status(404).send({
          isError: true,
          message: "New password and confirm password do not match",
          data: null,
        });

      if (!inputOldPassword || !inputNewPassword)
        return res.status(404).send({
          isError: true,
          message: "Password is empty",
          data: null,
        });

      let findUser = await db.user.findOne({
        where: {
          uid,
        },
      });

      let hashMatchResult = await matchPassword(
        inputOldPassword,
        findUser.dataValues.password
      );

      if (!hashMatchResult)
        return res.status(404).send({
          isError: true,
          message: "Old password is incorrect",
          data: null,
        });

      const hashedPassword = await hashPassword(inputNewPassword);

      const updatePassword = await db.user.update(
        {
          password: hashedPassword,
        },
        {
          where: {
            uid,
          },
        }
      );

      res.status(201).send({
        isError: false,
        message: "Change password is success",
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

  getUser: async (req, res) => {
    const { uid } = req.uid;
    try {
      const {
        id,
        first_name,
        last_name,
        email,
        gender,
        birth_date,
        birth_place,
        is_Updated,
        user_addresses,
      } = await db.user.findOne({
        where: { uid },
        include: { model: db.user_address },
      });
      const httpStatus = new HTTPStatus(res, {
        id,
        first_name,
        last_name,
        email,
        gender,
        birth_date,
        birth_place,
        is_Updated,
        user_addresses: {
          main_address: user_addresses.filter((value) => {
            return value.main_address === true;
          }),
          address: user_addresses.filter((value) => {
            return value.main_address === false;
          }),
        },
      }).success("Get user profile");
      httpStatus.send();
    } catch (error) {
      console.log(error);

      res.status(400).send({
        isError: true,
        message: error.message,
        data: error,
      });
    }
  },

  getToken: async (req, res) => {
    try {

      res.status(201).send({
        isError: false,
        message: "token ada",
        data: req.uid,
      })


    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: error
      })
    }
  }

};



