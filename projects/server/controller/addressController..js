const db = require("../sequelize/models");
const { Op } = require("sequelize");
const { sequelize } = require("../sequelize/models");
const axios = require("axios");

module.exports = {
  addAddress: async (req, res) => {
    const t = await sequelize.transaction();
    // const { uid } = req.query;
    const {
      recipient_name,
      recipient_phone,
      province,
      city,
      subdistrict,
      street_address,
      main_address,
      postal_code,
      uid,
    } = req.body;

    try {
      const { id } = await db.user.findOne({ where: { id } });
      if (main_address) {
        await db.user_address.update(
          { main_address: false },
          { where: { [Op.and]: [{ main_address }, { user_id: id }] } },
          { transaction: t }
        );
      }

      await db.user_address.create(
        {
          recipient_name,
          recipient_phone,
          province,
          city,
          subdistrict,
          street_address,
          main_address,
          postal_code,
          user_id: id,
        },
        { transaction: t }
      );
      t.commit();
      res.status(201).send({
        isError: false,
        message: "Address Successfully Added",
        data: null,
      });
    } catch (error) {
      console.log(error);
      t.rollback(),
        res.status(400).send({
          isError: true,
          message: error.message,
          data: error,
        });
    }
  },

  getAddress: async (req, res) => {
    const { id } = req.query;
    try {
      const address = await db.user_address.findAll({
        where: { user_id: id },
      });

      res.status(201).send({
        isError: false,
        message: "Masuk",
        data: address,
      });
    } catch (error) {
      console.log(error);

      res.status(400).send({
        isError: true,
        message: error.message,
        data: error,
      });
    }
  },

  editAddress: async (req, res) => {
    const { id } = req.body;
    try {
      const address = await db.user_address.findOne({
        where: { id },
      });

      req.status(201).send({
        isError: false,
        message: "",
        data: address,
      });
    } catch (error) {}
  },

  defaultAddress: async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction();
    try {
      await db.user_address.update(
        { main_address: false },
        { where: { main_address: true } },
        { transaction: t }
      );
      await db.user_address.update(
        { main_address: true },
        { where: { id } },
        { transaction: t }
      );
      t.commit();
      res.status(201).send({
        isError: false,
        messagae: "Main Address Selected",
        data: null,
      });
    } catch (error) {
      t.rollback();
      res.status(400).send({
        isError: true,
        message: error.message,
        data: error,
      });
    }
  },

  getProvince: async (req, res) => {
    try {
      const { data } = await axios.get(
        "https://api.rajaongkir.com/starter/province",
        { headers: { key: "c0cfdbc638201b0930f5a50e41a8f211" } }
      );
      res.status(200).send({
        isError: false,
        message: "Rajaongkir Province",
        data: data.rajaongkir.results,
      });
    } catch (error) {
      res.status(400).send({
        isError: true,
        message: error.message,
        data: error,
      });
    }
  },

  getCity: async (req, res) => {
    const { province_id } = req.query;
    try {
      if (!province_id)
        return res.status(404).send({
          isError: true,
          message: "Province_id is not found",
          data: null,
        });
      let response = await axios.get(
        `https://api.rajaongkir.com/starter/city?province=${province_id}`,
        {
          headers: { key: "c0cfdbc638201b0930f5a50e41a8f211" },
        }
      );

      res.status(200).send({
        isError: false,
        message: "Raja Ongkir City by Province",
        data: {
          rajaongkir: {
            country: "Indonesia",
            city: response.data.rajaongkir.results,
          },
        },
      });
    } catch (error) {
      res.status(400).send({
        isError: true,
        message: error.message,
        data: error,
      });
    }
  },

  deleteAddress: async (req, res) => {
    const { id } = req.params;
    try {
      await db.user_address.destroy({ where: { id } });
      res.status(201).send({
        isError: false,
        message: "Address deleted",
        data: null,
      });
    } catch (error) {
      res.status(400).send({
        isError: true,
        message: error.message,
        data: error,
      });
    }
  },
};
