require("dotenv").config();

const http = require("http");
const bcrypt = require("bcrypt");
let ejs = require("ejs");
var express = require("express");
var app = express();
var connection = require("./config/dbConfig");
var handlebars = require("express-handlebars");
const passport = require("passport");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var getJSON = require("get-json");
//!models
const IABshifts = require("./api/models/IABshifts.js");
const MEDICEFshifts = require("./api/models/MEDICEFshifts");

const session = require("express-session");
const flash = require("express-flash");

app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));
app.use("/node_modules", express.static("node_modules"));

// Enable express to parse body data from raw application/json data
app.use(express.json());

// Enables express to parse body data from x-www-form-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
  })
);
//!API
const apiEquipments = require("./api/routes/equipments");
app.use("/api/equipments", apiEquipments);
const apiRouterUsers = require("./api/routes/users");
app.use("/api/users", apiRouterUsers);
const apiProducts = require("./api/routes/products");
app.use("/api/products", apiProducts);
const apiManuelDataENtry = require("./api/routes/manualDataEntry");
app.use("/api/ManuelDataEntry", apiManuelDataENtry);
const apiReports = require("./api/routes/reports");
app.use("/api/reports", apiReports);

const apiIABshifts = require("./api/routes/IABshifts");
app.use("/api/iab/shifts", apiIABshifts);
const apiMEDICEFshifts = require("./api/routes/MEDICEFshifts");
app.use("/api/medicef/shifts", apiMEDICEFshifts);

const initializePassport = require("./config/passport-config");

app.use(passport.initialize());
app.use(passport.session());
/*app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});*/

const hostname = "0.0.0.0";
const port = 3000;

app.get("/", checkAuthenticated, function (req, res) {
  try {
    sql =
      "SELECT  (\
      SELECT COUNT(*)\
      FROM   equipment\
      ) AS equipment,\
      (\
      SELECT COUNT(*)\
      FROM   product\
      ) AS product,\
      (\
      SELECT COUNT(*)\
      FROM   user\
      ) AS account\
 FROM    dual";
    connection.query(sql, function (error, rows) {
      res.render("home", { user: req.user, count: rows[0] });
    });
  } catch (err) {
    res.render("home", { user: req.user });
  }
});
//testing purpose
app.get("/test", checkAuthenticated, function (req, res) {
  res.render("test");
});
app.get("/accounts", isAdmin, function (req, res) {
  res.render("accounts", { user: req.user });
});
app.get("/equipments", checkAuthenticated, function (req, res) {
  res.render("equipments", { user: req.user });
});
app.get("/reports", checkAuthenticated, function (req, res) {
  res.render("reports", {
    user: req.user,
  });
});

app.get("/products", checkAuthenticated, function (req, res) {
  res.render("products", { user: req.user });
});

app.get("/statistiques", checkAuthenticated, function (req, res) {
  res.render("statistiques", { user: req.user });
});
app.get("/manueldata", checkAuthenticated, function (req, res) {
  res.render("manuelDataEntry", {
    user: req.user,
  });
});
app.get("/login", checkNotAuthenticated, function (req, res) {
  res.render("login", { user: "SNOUSSI", title: "homepage" });
});
app.get("/register", isAdmin, function (req, res) {
  res.render("register");
});

var test = 0;
app.post(
  "/register",
  checkAuthenticated,
  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/register",
    failureFlash: true,
  })
);
app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    if (req.body.remember) {
      req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000; // Expires in 1 day
      console.log("remember checked");
    } else {
      req.session.cookie.expires = false;
      console.log("remember not checked");
    }
  }
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.access === "ADMIN") {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}
app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
