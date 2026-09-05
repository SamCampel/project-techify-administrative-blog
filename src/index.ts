import path from "node:path";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import connection from "./database/database";
import categoriesController from "./categories/CategoriesController";
import articlesController from "./articles/ArticlesController";
import usersController from "./users/UsersController";
import Article from "./articles/Article";
import Category from "./categories/Category";

const app = express();
const rootDirectory = path.resolve(__dirname, "..");

app.set("view engine", "ejs");
app.set("views", path.join(rootDirectory, "views"));

app.use(session({
  secret: process.env.SESSION_SECRET ?? "qualquercoisa",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30000000 },
}));
app.use(express.static(path.join(rootDirectory, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/", async (_req, res) => {
  const articles = await Article.findAll({ order: [["id", "DESC"]], limit: 4 });
  const categories = await Category.findAll();
  res.render("index", { articles, categories });
});

app.get("/:slug", async (req, res) => {
  try {
    const article = await Article.findOne({ where: { slug: req.params.slug } });
    if (article === null) {
      res.redirect("/");
      return;
    }
    const categories = await Category.findAll();
    res.render("article", { article, categories });
  } catch {
    res.redirect("/");
  }
});

app.get("/category/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { slug: req.params.slug },
      include: [{ model: Article }],
    });
    if (category === null) {
      res.redirect("/");
      return;
    }
    const categories = await Category.findAll();
    res.render("index", { articles: (category as any).articles, categories });
  } catch {
    res.redirect("/");
  }
});

connection.authenticate()
  .then(() => console.log("Conexão feita com sucesso!"))
  .catch((error: unknown) => console.log(error));

connection.sync({ force: false })
  .then(() => console.log("Tabelas sincronizadas!"))
  .catch((error: unknown) => console.log("Erro ao sincronizar tabelas:", error));

app.listen(1212, () => console.log("O servidor está rodando!"));