const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Models
const User = require("../models/users");

router.use(express.json());

router.get("/", (req, res) => {
  res.render("index", { title: "Login" });
});

router.get("/signup", (req, res) => {
  res.render("signup", { title: "Cadastrar-se" });
});

// Cadastrando Usuário
router.post("/signup", async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  // Verificando se o usuáro já existe no DB
  const verifyUser = await User.findOne({ email: user.email });

  if (verifyUser) {
    res.redirect("/signup");
    console.log("Usuário já existe");
  } else if (!verifyUser && user.password === user.confirmPassword) {
    //Encriptando senha usando bcrypt

    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Trocando valor do senha original
    user.password = hashedPassword;
    user.confirmPassword = hashedPassword;

    await User.insertMany(user);
    res.redirect("/");
  } else {
    res.redirect("/signup");
    console.log("Senhas não combinam");
  }
});

// Logando Usuário
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("Email não encontrado no banco de dados!");
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);

    if (isValid) {
      res.render("home", { title: "Página Inicial" });
    } else {
      req.send("Erro nas credenciais");
    }
  } catch {
    res.redirect("/");
    console.log("Email ou senha incorreto!");
  }
});

module.exports = router;
