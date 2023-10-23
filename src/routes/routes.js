const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Login" });
});

router.get("/signup", (req, res) => {
  res.render("signup", { title: "Cadastrar-se" });
});

module.exports = router;
