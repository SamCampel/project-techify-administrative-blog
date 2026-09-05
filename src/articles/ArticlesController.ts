import express from "express";
import slugify from "slugify";
import Category from "../categories/Category";
import Article from "./Article";
import adminAuth from "../middlewares/adminAuth";

const router = express.Router();

router.get("/admin/articles", adminAuth, (_req, res) => {
  Article.findAll({ include: [{ model: Category }] }).then((articles: unknown[]) => {
    res.render("admin/articles/index", { articles });
  });
});

router.get("/admin/articles/new", adminAuth, (_req, res) => {
  Category.findAll().then((categories: unknown[]) => {
    res.render("admin/articles/new", { categories });
  });
});

router.post("/articles/save", adminAuth, (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const categoryId = Number(req.body.category);
  if (typeof title === "string" && typeof body === "string" && Number.isInteger(categoryId)) {
    Article.create({ title, slug: slugify(title), body, categoryId })
      .then(() => res.redirect("/admin/articles"));
  } else {
    res.redirect("/admin/articles/new");
  }
});

router.post("/articles/delete", adminAuth, (req, res) => {
  const id = Number(req.body.id);
  if (Number.isInteger(id)) {
    Article.destroy({ where: { id } }).then(() => res.redirect("/admin/articles"));
  } else {
    res.redirect("/admin/articles");
  }
});

router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
  const id = Number(req.params.id);
  Article.findByPk(id).then((article: unknown) => {
    if (article !== null) {
      Category.findAll().then((categories: unknown[]) => {
        res.render("admin/articles/edit", { categories, article });
      });
    } else {
      res.redirect("/");
    }
  }).catch(() => res.redirect("/"));
});

router.post("/articles/update", adminAuth, (req, res) => {
  const id = Number(req.body.id);
  const title = req.body.title;
  const body = req.body.body;
  const categoryId = Number(req.body.category);
  if (Number.isInteger(id) && typeof title === "string" && typeof body === "string" && Number.isInteger(categoryId)) {
    Article.update({ title, body, categoryId, slug: slugify(title) }, { where: { id } })
      .then(() => res.redirect("/admin/articles"));
  } else {
    res.redirect("/");
  }
});

router.get("/articles/page/:num", (req, res) => {
  const page = Number(req.params.num);
  const currentPage = Number.isInteger(page) && page > 0 ? page : 1;
  const offset = (currentPage - 1) * 4;
  Article.findAndCountAll({ limit: 4, offset }).then((result: any) => {
    Category.findAll().then((categories: unknown[]) => {
      res.render("admin/articles/page", {
        result: { page: currentPage, next: offset + 4 < result.count, articles: result },
        categories,
      });
    });
  });
});

export default router;