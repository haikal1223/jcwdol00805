'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      main_address: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      street_address: {
        type: Sequelize.STRING
      },
      subdistrict: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      province: {
        type: Sequelize.STRING
      },
      recipient_name: {
        type: Sequelize.STRING
      },
      recipient_phone: {
        type: Sequelize.INTEGER
      },
      postal_code: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_addresses');
  }

};