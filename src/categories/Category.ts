const Sequelize = require("sequelize") as any;
import connection from "../database/database";

const Category = connection.define("categories", {
  title: { type: Sequelize.STRING, allowNull: false },
  slug: { type: Sequelize.STRING, allowNull: false },
});

export default Category as any;