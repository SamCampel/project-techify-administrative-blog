import { RequestHandler } from "express";

const adminAuth: RequestHandler = (req, res, next) => {
  if (req.session.user !== undefined) {
    next();
  } else {
    res.redirect("/login");
  }
};

export default adminAuth;