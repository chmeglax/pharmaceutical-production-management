require("dotenv").config();

const http = require("http");
const bcrypt = require("bcrypt");
let ejs = require("ejs");
var express = require("express");
var app = express();
var connection = require("./config/dbConfig");
const mongoose = require("mongoose");
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
/*initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)*/

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
  res.render("home", { user: req.user, title: "homepage" });
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
  var shiftAll = {};

  getJSON("http://127.0.0.1:3000/api/iab/shifts/", function (error, iab) {
    getJSON("http://127.0.0.1:3000/api/medicef/shifts/", function (
      error,
      medicef
    ) {
      switch (iab.number) {
        case "1":
          iab.type = "Extended";
          break;
        case "2":
          iab.type = "Two shifts";
          break;
        default:
          iab.type = "Three shifts";
          break;
      }
      switch (medicef.number) {
        case "1":
          medicef.type = "Extended";
          break;
        case "2":
          medicef.type = "Two shifts";
          break;
        default:
          medicef.type = "Three shifts";
          break;
      }
      res.render("reports", {
        user: req.user,
        shift: { iab: iab, medicef: medicef },
      });
    });
  });
});

app.get("/shifts", checkAuthenticated, function (req, res) {
  var shiftAll = {};

  getJSON("http://127.0.0.1:3000/api/iab/shifts/", function (error, iab) {
    getJSON("http://127.0.0.1:3000/api/medicef/shifts/", function (
      error,
      medicef
    ) {
      switch (iab.number) {
        case "1":
          iab.type = "Extended";
          break;
        case "2":
          iab.type = "Two shifts";
          break;
        default:
          iab.type = "Three shifts";
          break;
      }
      switch (medicef.number) {
        case "1":
          medicef.type = "Extended";
          break;
        case "2":
          medicef.type = "Two shifts";
          break;
        default:
          medicef.type = "Three shifts";
          break;
      }
      res.render("shifts", {
        user: req.user,
        shift: { iab: iab, medicef: medicef },
      });
    });
  });
});
app.get("/products", checkAuthenticated, function (req, res) {
  res.render("products", { user: req.user });
});
app.get("/operators", checkAuthenticated, function (req, res) {
  res.render("operators", { user: req.user });
});
app.get("/statistiques", checkAuthenticated, function (req, res) {
  res.render("statistiques", { user: req.user });
});
app.get("/manueldata", checkAuthenticated, function (req, res) {
  getJSON("http://127.0.0.1:3000/api/iab/shifts/", function (error, iab) {
    getJSON("http://127.0.0.1:3000/api/medicef/shifts/", function (
      error,
      medicef
    ) {
      res.render("manuelDataEntry", {
        user: req.user,
        shift: { iab: iab, medicef: medicef },
      });
    });
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
  /*try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    var name = req.body.name;
    var email = req.body.email;
    var password = hashedPassword;
    var department = req.body.department;
    var access = req.body.type;
    var site = req.body.site;
    var phone = req.body.phone;
    var poste = req.body.position;
    var sql =
      " INSERT INTO `user` (`poste`, `name`, `phone`, `email`, `pwd`, `department`, `site_id`, `access`) \
      VALUES (?,?,?,?,?,?,?,?);";
    connection.query(
      sql,
      [poste, name, phone, email, password, department, site, access],
      function (error, rows) {
        if (error) console.log(error);
        res.json({ message: " user inserted" });
      }
    );
    res.redirect("/accounts");
  } catch {
    res.redirect("/register");
  }*/
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
