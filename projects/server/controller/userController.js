const { hashPassword } = require("../lib/hash");
const db = require("../models/index");
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

};
