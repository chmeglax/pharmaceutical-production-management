const express = require("express");
const router = express.Router();
const Equipments = require("../models/IABequipment");

var doc = [
  { name: "Blister machine Marcheseni MB421 (Line1)", type: "packaging" },
  { name: "Cartonner Marcheseni MA100 (Line1)", type: "packaging" },
  { name: "Checkweigher (Line1)", type: "packaging" },
  { name: "Labelling machine (Line1)", type: "packaging" },
  { name: "Blister machine Marcheseni MB421 (Line2)", type: "packaging" },
  { name: "Cartonner Marcheseni MA100 (Line2)", type: "packaging" },
  { name: "Checkweigher (Line2)", type: "packaging" },
  { name: "Labelling machine (Line2)", type: "packaging" },
  { name: "Blistereuse Klockner  (Line 3)", type: "packaging" },
  { name: "Counter 1", type: "packaging" },
  { name: "Counter 2", type: "packaging" },
  { name: "Bottel labelling machine", type: "packaging" },
  { name: "Printer Linx 7300", type: "packaging" },
  { name: "Printer Linx 5900", type: "packaging" },
  { name: "Printer Linx 8920", type: "packaging" },
  { name: "Weighing box", type: "processing" },
  { name: "Mixer Diosna", type: "processing" },
  { name: "Oven Italvacuum", type: "processing" },
  { name: "Blender Novinox", type: "processing" },
  { name: "Blender Shang Yuh ", type: "processing" },
  { name: "Sifter 1", type: "processing" },
  { name: "Sifter 2", type: "processing" },
  { name: "Mill Frewitt GR04", type: "processing" },
  { name: "Mill Frewitt GR05", type: "processing" },
  { name: "Mill STE GR06", type: "processing" },
  { name: "Tabletting machine Fette", type: "processing" },
  { name: "Metal detector Fette", type: "processing" },
  { name: "Tabletting machine Manesty", type: "processing" },
  { name: "Metal detector Manesty", type: "processing" },
  { name: "Encapsulation machine IMA Zanasi", type: "processing" },
  { name: "Metal detector IMA Zanasi", type: "processing" },
  { name: "Encapsulation machine Dott.Bonapace", type: "processing" },
  { name: "Powder machine MOM", type: "processing" },
  { name: "Coating machine GS Coating", type: "processing" },
  { name: "Chiller 1", type: "utility" },
  { name: "Chiller 2", type: "utility" },
  { name: "Water treatement unit ", type: "utility" },
  { name: "Air handling unit AHU 1", type: "utility" },
  { name: "Air handling unit AHU 2", type: "utility" },
  { name: "Air handling unit AHU 3", type: "utility" },
  { name: "Air handling unit AHU 4", type: "utility" },
  { name: "Air handling unit AHU 5", type: "utility" },
  { name: "Compressed air unit", type: "utility" },
  { name: "Power generator", type: "utility" },
];

// Getting all
router.get("/", async (req, res) => {
  var Equipmentss;
  try {
    //Equipments.insertMany(doc);
    Equipmentss = await Equipments.find();
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
    type: req.body.type,
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
    res.Equipments.type = req.body.type;
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
