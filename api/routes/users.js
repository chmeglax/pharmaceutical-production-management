const express = require("express");
const router = express.Router();
const users = require("./../../config/database.js");

// Getting all
router.get("/", async (req, res) => {
  var userss;
  try {
    if (req.query.search) {
      var regexp = new RegExp("^" + req.query.search.toLowerCase(), "i");
      userss = await users.find({
        name: regexp,
      });
    } else userss = await users.find();
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
    const newEquipments = await user.save();
    res.redirect("/");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch("/:id", getUsers, async (req, res) => {
  if (req.body.name != null) {
    res.users.name = req.body.name;
  }
  try {
    const updatedEquipments = await res.users.save();
    res.json(updatedEquipments);
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
