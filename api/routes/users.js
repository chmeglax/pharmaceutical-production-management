const express = require("express");
const router = express.Router();
const users = require("./../../config/database.js");

// Getting all
router.get("/", async (req, res) => {
  /*try {
    users.insertMany([
      {
        access: { site: "all", type: "MANAGER" },
        name: "Chaima fourati",
        email: "Chaima23@hikma.com",
        password:
          "$2b$10$rQJcy5d7Jq/76.CIU6qJc.onGjH236NhwVycFG7NB.uGFu6MWbzzq",
        department: "production",
        phone: 55721212,
      },
      {
        access: { site: "all", type: "READONLY" },
        name: "khaled yessine",
        email: "khaled32@hikma.com",
        password:
          "$2b$10$rQJcy5d7Jq/76.CIU6qJc.onGjH236NhwVycFG7NB.uGFu6MWbzzq",
        department: "production",
        phone: 55721212,
      },
      {
        access: { site: "all", type: "READONLY" },
        name: "samir Snoussii",
        email: "samir23@hikma.com",
        password:
          "$2b$10$rQJcy5d7Jq/76.CIU6qJc.onGjH236NhwVycFG7NB.uGFu6MWbzzq",
        department: "production",
        phone: 55721212,
      },
      {
        access: { site: "all", type: "READONLY" },
        name: "haifa dima",
        email: "haifa32@hikma.com",
        password:
          "$2b$10$rQJcy5d7Jq/76.CIU6qJc.onGjH236NhwVycFG7NB.uGFu6MWbzzq",
        department: "production",
        phone: 55721212,
      },
    ]);
  } catch (e) {
    print(e);
  }*/
  var userss;
  try {
    userss = await users.find();
    res.json(userss);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One
router.get("/:id", getUsers, (req, res) => {
  res.json(res.users);
});

// Creating one
router.post("/", async (req, res) => {
  const user = new users({
    name: req.body.name,
  });
  try {
    const newusers = await user.save();
    res.redirect("/");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch("/:id", getUsers, async (req, res) => {
  if (req.body.name != null) {
    res.users.name = req.body.name;
    res.users.email = req.body.email;
    res.users.department = req.body.department;
    res.users.phone = req.body.phone;
    res.users.access.site = req.body.access.site;
    res.users.access.type = req.body.access.type;
  }
  try {
    const updatedusers = await res.users.save();
    res.json(updatedusers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", getUsers, async (req, res) => {
  try {
    await res.users.remove();
    res.json({ message: "Deleted users" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUsers(req, res, next) {
  let user;
  try {
    user = await users.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find users" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.users = user;
  next();
}

module.exports = router;
