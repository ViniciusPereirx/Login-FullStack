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
  const userExist = await User.findOne({ email: user.email });

  if (userExist) {
    req.session.message = {
      type: "danger",
      message: "Já existe esse email cadastrado.",
    };
    res.redirect("/signup");
  } else if (!userExist && user.password === user.confirmPassword) {
    //Encriptando senha usando bcrypt
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Trocando valor do senha original
    user.password = hashedPassword;
    user.confirmPassword = hashedPassword;

    await User.insertMany(user);
    req.session.message = {
      type: "success",
      message: "Usuário cadastrado com sucesso.",
    };
    res.redirect("/");
  } else {
    req.session.message = {
      type: "danger",
      message: "Senhas não estão combinando.",
    };
    res.redirect("/signup");
  }
});

// Logando Usuário
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.session.message = {
        type: "danger",
        message: "Email não cadastrado.",
      };
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);

    if (isValid) {
      res.render("home", { title: "Página Inicial" });
    } else {
      req.session.message = {
        type: "danger",
        message: "Email ou senha incorretos.",
      };
      res.redirect("/");
    }
  } catch {
    res.redirect("/");
    console.log("Erro na credenciais");
  }
});

module.exports = router;
