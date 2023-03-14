const { sequelize } = require("sequelize");
const { UUIDV4 } = require("sequelize");
const { hashPassword } = require("../lib/hash");
const db = require("../models/index");
const { uploader } = require("../lib/multer");
const fs = require("fs");
const { error } = require("console");

module.exports = {
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

  addData: async (req, res) => {
    try {
      let { first_name, last_name, email } = req.body;

      let createUser = await db.user.create({
        first_name,
        last_name,
        email,
        role: "user",
        is_verified: 0,
      });

      res.status(201).send({
        isError: false,
        message: "Registration is success",
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

  inputPassword: async (req, res) => {
    try {
      let { password } = req.body;
      const hashedPassword = await hashPassword(password);

      const updatePassword = await db.user.update(
        {
          password: hashedPassword,
          is_verified: 1,
          profile_photo: "Publicimagesdefault.svg",
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
    } catch (error) {}
  },

  uploadPhoto: async (req, res) => {
    try {
      let { uid } = req.params;
      let data = req.body.data;
      const { file } = req.files;
      console.log(data);

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
      console.log(error);
      res.status(500).send({
        isError: true,
        message: "Something Error",
        data: null,
      });
    }
  },

};
