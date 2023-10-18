const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

// Middlewares
app.use(express.json());

app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));
app.use(express.static(__dirname + "/public"));

// Rotas
app.use("/", require("./src/routes/routes"));

app.listen(3000, () => {
  console.log("Servidor Ligado!");
});
