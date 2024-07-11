let config = require('../config/db.config')
const Sequelize = config.Sequelize;
const sequelize = config.sequelize;

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

function table_event() {
  const Table = sequelize.define(
    "event",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      details: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        //planning
        type: Sequelize.DATE,
        allowNull: false,
      }
    },
    {
      underscored: true,
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
      tableName: "events",
    }
  );
  return Table;
}

db.event = table_event();

module.exports = db;
