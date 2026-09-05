import express from "express";
import slugify from "slugify";
import Category from "./Category";

const router = express.Router();

router.get("/admin/categories/new", (_req, res) => {
  res.render("admin/categories/new");
});

router.post("/categories/save", (req, res) => {
  const title = req.body.title;
  if (typeof title === "string" && title.trim() !== "") {
    Category.create({ title, slug: slugify(title) }).then(() => {
      res.redirect("/admin/categories");
    });
  } else {
    res.redirect("/admin/categories/new");
  }
});

router.get("/admin/categories", (_req, res) => {
  Category.findAll().then((categories: unknown[]) => {
    res.render("admin/categories/index", { categories });
  });
});

router.post("/categories/delete", (req, res) => {
  const id = Number(req.body.id);
  if (Number.isInteger(id)) {
    Category.destroy({ where: { id } }).then(() => res.redirect("/admin/categories"));
  } else {
    res.redirect("/admin/categories");
  }
});

router.get("/admin/categories/edit/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.redirect("/admin/categories");
    return;
  }

  Category.findByPk(id).then((category: unknown) => {
    if (category !== null) {
      res.render("admin/categories/edit", { category });
    } else {
      res.redirect("/admin/categories");
    }
  }).catch(() => res.redirect("/admin/categories"));
});

router.post("/categories/update", (req, res) => {
  const id = Number(req.body.id);
  const title = req.body.title;
  if (Number.isInteger(id) && typeof title === "string" && title.trim() !== "") {
    Category.update({ title, slug: slugify(title) }, { where: { id } })
      .then(() => res.redirect("/admin/categories"));
  } else {
    res.redirect("/admin/categories");
  }
});

export default router;