const express = require("express");
const router = express.Router();
const connection = require("./../../config/dbConfig");

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
router.get("/:site", async (req, res) => {
  try {
    if (req.params.site == "chart")
      sql =
        "SELECT Category ,count(*) as Number FROM hikma.equipment where Category is not null group by Category ";
    else
      sql =
        "select e.id,e.name,e.parc as parcId,Line,Category,p.name as parc from equipment e\
    inner join parc p on p.id = e.parc\
    where e.site_id=" +
        req.params.site +
        "; ";
    connection.query(sql, function (error, rows) {
      res.json(rows);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creating one
router.post("/", async (req, res) => {
  var name = req.body.name;
  var type = req.body.type;
  var site = req.body.site;
  try {
    var sql =
      "INSERT INTO `hikma`.`equipment` (`name`, `parc`, `site_id`) VALUES (?,?,?);";
    connection.query(sql, [name, type, site], function (error, rows) {
      if (error) return res.status(500).json({ message: error });
      res.json({ message: "added equipment" });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch("/:id", async (req, res) => {
  try {
    var name = req.body.name;
    var type = req.body.type;
    var sql =
      " UPDATE `equipment` SET `name` =? ,\
    `parc` = ? WHERE (`id` = ?);";
    connection.query(sql, [name, type, req.params.id], function (error, rows) {
      if (error) return res.status(500).json({ message: error });
      res.json({ message: "updated equipment" });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", async (req, res) => {
  try {
    var sql = "DELETE FROM `equipment` WHERE (`id` = ?)";
    connection.query(sql, req.params.id, function (error, rows) {
      if (error) return res.status(500).json({ message: error });
      res.json({ message: "deleted equipment" });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
