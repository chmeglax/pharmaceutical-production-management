require("dotenv").config();

const http = require("http");
const bcrypt = require("bcrypt");
let ejs = require("ejs");
var express = require("express");
var app = express();
const mongoose = require("mongoose");
var handlebars = require("express-handlebars");
const passport = require("passport");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

const session = require("express-session");
const flash = require("express-flash");
const User = require("./config/database.js");

app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));
app.use("/node_modules", express.static("node_modules"));
// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require("connect-mongo")(session);

// Enable express to parse body data from raw application/json data
app.use(express.json());

// Enables express to parse body data from x-www-form-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
//!API
const apiRouterEquipments = require("./api/routes/equipments");
app.use("/api/equipments", apiRouterEquipments);
const apiRouterUsers = require("./api/routes/users");
app.use("/api/users", apiRouterUsers);

const initializePassport = require("./config/passport-config");
/*initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)*/

app.use(flash());
const sessionStore = new MongoStore({
  mongooseConnection: mongoose.createConnection("mongodb://localhost/hikma", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }),
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
/*app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});*/

const hostname = "127.0.0.1";
const port = 3000;

app.get("/", checkAuthenticated, function (req, res) {
  res.render("home", { user: req.user.name, title: "homepage" });
});
//testing purpose
app.get("/test", checkAuthenticated, function (req, res) {
  res.render("test");
});
app.get("/accounts", isAdmin, function (req, res) {
  res.render("accounts", { user: req.user.name });
});
app.get("/equipments", checkAuthenticated, function (req, res) {
  res.render("equipments", { user: req.user.name });
});
app.get("/shifts", checkAuthenticated, function (req, res) {
  res.render("shifts", { user: req.user.name });
});
app.get("/products", checkAuthenticated, function (req, res) {
  res.render("products", { user: req.user.name });
});
app.get("/operators", checkAuthenticated, function (req, res) {
  res.render("operators", { user: req.user.name });
});
app.get("/statistiques", checkAuthenticated, function (req, res) {
  res.render("statistiques", { user: req.user.name });
});
app.get("/login", checkNotAuthenticated, function (req, res) {
  /* User.find({
    email: "w@w"
}).exec(function(err, users) {
    if (err) throw err;
     
    console.log("email="+users[0].toObject().password);
});*/

  res.render("login", { user: "SNOUSSI", title: "homepage" });
});
app.get("/register", checkAuthenticated, function (req, res) {
  res.render("register");
});

var test = 0;
app.post("/register", checkAuthenticated, async function (req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      department: req.body.department,
      access: {
        site: req.body.site,
        type: req.body.type,
      },
      phone: req.body.phone,
    });
    newUser.save();
    res.redirect("/accounts");
  } catch {
    res.redirect("/register");
  }
});
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
  if (req.isAuthenticated() && req.user.access.type === "admin") {
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
