const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  'calendarabba',
  "root",
  "root",
  {
    host: "127.0.0.1",
    port: 3306,
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 30000,
    },
    operatorAliases: false,
    pool: {
      max: 100,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_0900_ai_ci",
    },
    logging: true,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize.sync();

module.exports = db;
