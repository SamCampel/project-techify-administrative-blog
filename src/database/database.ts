import dotenv from "dotenv";

dotenv.config({ override: true });

// Sequelize 6 exposes an incomplete declaration bundle in this installation.
// Keep its runtime API behind this boundary while the application remains typed.
const Sequelize = require("sequelize") as any;
const connection = new Sequelize(
  process.env.DB_NAME ?? "",
  process.env.DB_USER ?? "",
  process.env.DB_PASSWORD ?? "",
  {
    host: process.env.DB_HOST,
    dialect: (process.env.DB_DIALECT as "mysql") ?? "mysql",
    timezone: "-03:00",
  },
);

export default connection;