import express from "express";
import bcrypt from "bcryptjs";
import User from "./User";
import Category from "../categories/Category";

const router = express.Router();

router.get("/admin/users", (_req, res) => {
  User.findAll().then((users: unknown[]) => {
    Category.findAll().then((categories: unknown[]) => {
      res.render("admin/users/index", { users, categories });
    });
  });
});

router.get("/admin/users/create", (_req, res) => {
  Category.findAll().then((categories: unknown[]) => {
    res.render("admin/users/create", { categories });
  });
});

router.post("/users/create", (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const password = req.body.password;
  if (typeof nome !== "string" || typeof email !== "string" || typeof password !== "string") {
    res.redirect("/admin/users/create");
    return;
  }

  User.findOne({ where: { email } }).then((user: unknown) => {
    if (user === null) {
      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      User.create({ nome, email, password: hash })
        .then(() => res.redirect("/"))
        .catch(() => res.redirect("/"));
    } else {
      res.redirect("/admin/users/create");
    }
  });
});

router.post("/users/delete", (req, res) => {
  const id = Number(req.body.id);
  if (Number.isInteger(id)) {
    User.destroy({ where: { id } }).then(() => res.redirect("/admin/users"));
  } else {
    res.redirect("/admin/users");
  }
});

router.get("/login", (_req, res) => {
  Category.findAll().then((categories: unknown[]) => {
    res.render("admin/users/login", { categories });
  });
});

router.post("/authenticate", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ where: { email } }).then((user: any) => {
    const isValidPassword = !!user && typeof user.password === "string" &&
      (user.password === password || bcrypt.compareSync(password, user.password));

    if (user !== null && isValidPassword) {
      req.session.user = { id: user.id, email: user.email };
      res.redirect("/admin/articles");
    } else {
      res.redirect("/login");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

export default router;