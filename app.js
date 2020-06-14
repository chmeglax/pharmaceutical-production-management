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

const session = require("express-session");
const flash = require("express-flash");
const jwt = require("jsonwebtoken");
app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));
app.use("/node_modules", express.static("node_modules"));

// Enable express to parse body data from raw application/json data
app.use(express.json());
app.use(bodyParser.json());
// Enables express to parse body data from x-www-form-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());

app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
  })
);

//passport
const passportConfig = require("./config/passport-config");

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("remember-me"));
//!API
const apiEquipments = require("./api/routes/equipments");
app.use("/api/equipments", checkAuthenticated, apiEquipments);
const apiRouterUsers = require("./api/routes/users");
app.use("/api/users", isAdmin, apiRouterUsers);
const apiProducts = require("./api/routes/products");
app.use("/api/products", checkAuthenticated, apiProducts);
const apiManuelDataENtry = require("./api/routes/manualDataEntry");
app.use("/api/ManuelDataEntry", checkAuthenticated, apiManuelDataENtry);
const apiReports = require("./api/routes/reports");
app.use("/api/reports", checkAuthenticated, apiReports);

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
app.get("/realTimeSupervision", checkAuthenticated, function (req, res) {
  res.render("realTimeSupervision", {
    user: req.user,
    raspberryIP: process.env.RASPBERRY_IP,
  });
});
app.get("/accounts", function (req, res) {
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
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async function (req, res, next) {
    await generateToken(res, req.user.id, req.user.email);

    // Issue a remember me cookie if the option was checked
    if (!req.body.remember) {
      return next();
    }

    passportConfig(req.user, function (err, token) {
      if (err) {
        return next(err);
      }
      res.cookie("remember_me", token, {
        path: "/",
        httpOnly: true,
        maxAge: 604800000,
      });
      return next();
    });
  },
  function (req, res) {
    res.redirect("/");
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
  res.clearCookie("remember_me");
  req.logOut();

  res.redirect("/login");
});
var server = app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

async function verifyToken(req, res, next) {
  const token = req.cookies.token || "";
  try {
    if (!token) {
      return res.status(401).json("You need to Login");
    }
    const decrypt = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decrypt.id,
      firstname: decrypt.firstname,
    };
    next();
  } catch (err) {
    return res.status(500).json(err.toString());
  }
}
function generateToken(res, id, firstname) {
  const expiration = process.env.DB_ENV === "testing" ? 100 : 604800000;
  const token = jwt.sign({ id, firstname }, process.env.JWT_SECRET, {
    expiresIn: process.env.DB_ENV === "testing" ? "1d" : "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: 3600000,
  });
}

//!socketIo
var io = require("socket.io").listen(server);

io.on("connection", function (socket) {
  console.log("Client Connected");

  socket.on("product", function (state) {
    console.log("product now : " + state);
    io.emit("product", state);
  });
  socket.on("shutdown", function (msg) {
    console.log("shutdown: " + msg);
    io.emit("shutdown", msg);
  });
  socket.on("temp", function (msg) {
    console.log("temp: " + msg);
    io.emit("temp", msg);
  });
});
