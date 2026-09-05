const Sequelize = require("sequelize") as any;
import connection from "../database/database";

const User = connection.define("users", {
  nome: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
});

export default User as any;