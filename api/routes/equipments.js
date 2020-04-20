const express = require("express");
const router = express.Router();
const Equipments = require("./../models/equipment");

// Getting all
router.get("/", async (req, res) => {
  var Equipmentss;
  try {
    if (req.query.search) {
      var regexp = new RegExp("^" + req.query.search);
      Equipmentss = await Equipments.find({
        name: regexp,
      });
    } else Equipmentss = await Equipments.find();
    res.json(Equipmentss);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One
router.get("/:id", getEquipments, (req, res) => {
  res.json(res.Equipments);
});

// Creating one
router.post("/", async (req, res) => {
  const Equipment = new Equipments({
    name: req.body.name,
  });
  try {
    const newEquipments = await Equipment.save();
    res.redirect("/");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch("/:id", getEquipments, async (req, res) => {
  if (req.body.name != null) {
    res.Equipments.name = req.body.name;
  }
  try {
    const updatedEquipments = await res.Equipments.save();
    res.json(updatedEquipments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", getEquipments, async (req, res) => {
  try {
    await res.Equipments.remove();
    res.json({ message: "Deleted Equipments" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getEquipments(req, res, next) {
  let Equipment;
  try {
    Equipment = await Equipments.findById(req.params.id);
    if (Equipment == null) {
      return res.status(404).json({ message: "Cannot find Equipments" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.Equipments = Equipment;
  next();
}

module.exports = router;
