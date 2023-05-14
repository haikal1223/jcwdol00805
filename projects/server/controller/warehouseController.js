const { createToken } = require("../lib/jwt");
const db = require("../sequelize/models");

const { sequelize } = require("../sequelize/models");

const bcrypt = require("bcrypt");
const axios = require("axios");

module.exports = {
  addWarehouseData: async (req, res) => {
    const { name, city, province, lat, lng } = req.body;

    if (!name || !city || !province || !lat || !lng)
      return res.status(404).send({
        isError: true,
        message: "Please Complete Warehouse Data",
        data: null,
      });

    let findWarehouse = await db.warehouse.findOne({
      where: {
        name,
      },
    });

    if (findWarehouse)
      return res.status(404).send({
        isError: true,
        message: "Warehouse already exist",
        data: null,
      });

    await db.warehouse.create({
      name,
      city,
      province,
      lat,
      lng,
    });

    res.status(201).send({
      isError: false,
      message: "Add Warehouse Success",
      data: null,
    });
  },
  findAllWarehouseData: async (req, res) => {
    try {
      const warehouses = await db.warehouse.findAll();

      if (!warehouses.length) {
        return res.status(404).send({
          isError: true,
          message: "No warehouses found",
          data: null,
        });
      }

      return res.status(200).send({
        isError: false,
        message: "All warehouses retrieved successfully",
        data: warehouses,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        isError: true,
        message: "Error retrieving warehouses",
        data: null,
      });
    }
  },

  findOneWarehouseData: async (req, res) => {
    const warehouseId = req.params.id;

    let foundWarehouse = await db.warehouse.findOne({
      where: {
        id: warehouseId,
      },
    });

    if (!foundWarehouse) {
      return res.status(404).send({
        isError: true,
        message: "Warehouse not found",
        data: null,
      });
    }

    return res.status(200).send({
      isError: false,
      message: "Warehouse found",
      data: foundWarehouse,
    });
  },
  editWarehouseData: async (req, res) => {
    const warehouseId = req.params.id;
    const { name, city, province, lat, lng } = req.body;

    let foundWarehouse = await db.warehouse.findOne({
      where: {
        id: warehouseId,
      },
    });

    if (!foundWarehouse) {
      return res.status(404).send({
        isError: true,
        message: "Warehouse not found",
        data: null,
      });
    }

    foundWarehouse.name = name || foundWarehouse.name;
    foundWarehouse.city = city || foundWarehouse.city;
    foundWarehouse.province = province || foundWarehouse.province;
    foundWarehouse.lat = lat || foundWarehouse.lat;
    foundWarehouse.lng = lng || foundWarehouse.lng;

    await foundWarehouse.save();

    return res.status(200).send({
      isError: false,
      message: "Warehouse updated successfully",
      data: foundWarehouse,
    });
  },

  removeWarehouseData: async (req, res) => {
    const warehouseId = req.params.id;

    let foundWarehouse = await db.warehouse.findOne({
      where: {
        id: warehouseId,
      },
    });

    if (!foundWarehouse) {
      return res.status(404).send({
        isError: true,
        message: "Warehouse not found",
        data: null,
      });
    }

    await foundWarehouse.destroy();

    return res.status(200).send({
      isError: false,
      message: "Warehouse deleted successfully",
      data: null,
    });
  },
};
