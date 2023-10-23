const express = require("express");
const router = express.Router();

// Models
const User = require("../models/users");

router.get("/", (req, res) => {
  res.render("index", { title: "Login" });
});

router.get("/signup", (req, res) => {
  res.render("signup", { title: "Cadastrar-se" });
});

router.post("/signup", (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  user
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      res.json(console.log("Deu errado ao cadastrar-se"));
    });
});

module.exports = router;
