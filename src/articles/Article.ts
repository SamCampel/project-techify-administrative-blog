const Sequelize = require("sequelize") as any;
import connection from "../database/database";
import Category from "../categories/Category";

const Article = connection.define("articles", {
  title: { type: Sequelize.STRING, allowNull: false },
  slug: { type: Sequelize.STRING, allowNull: false },
  body: { type: Sequelize.TEXT, allowNull: false },
  categoryId: { type: Sequelize.INTEGER, allowNull: false },
});

Category.hasMany(Article);
Article.belongsTo(Category);

export default Article as any;