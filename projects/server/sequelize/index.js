const { sequelize } = require("./models");

sequelize
  .authenticate()
  .then(() => {
    sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Database Synced");
  })
  .catch((error) => {
    console.log(error);
  });
//Error 3780: Referencing column 'user_uid' and referenced column 'id' in foreign key constraint 'carts_ibfk_1' are incompatible. SQL Statement:  ALTER TABLE `db_warehouse_dummy`.`carts`  ADD CONSTRAINT `carts_ibfk_1`   FOREIGN KEY (`user_uid`)   REFERENCES `db_warehouse_dummy`.`users` (`id`)   ON DELETE SET NULL   ON UPDATE CASCADE
