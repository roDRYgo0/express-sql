var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var expressJwt = require("express-jwt");

var Routes = require("./api/routes");

var app = express();

require("./db/models");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  expressJwt({ secret: process.env.TOKEN_SECRET }).unless({
    path: ["/auth/", "/first/"]
  })
);
// Core Routes
app.use("/auth", Routes["AuthRoute"]);
app.use("/first", Routes["FirstRoute"]);
app.use("/profile", Routes["ProfileRoute"]);

// Routes
app.use("/users", Routes["UsersRoute"]);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (err === 404) {
    return res.status(404).send({ message: "No se encontraron coincidencias" });
  } else if (err === 401) {
    return res.status(err).send(createError(err));
  }
  return res.status(err.status || 500).send({
    message: err.message,
    error: err
  });
});

module.exports = app;
