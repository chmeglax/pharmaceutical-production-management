const express = require("express");
const router = express.Router();
const connection = require("./../../config/dbConfig");
function formatDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "-" + mm + "-" + yyyy;

  return today;
}

var doc = [
  {
    name: "ATARAX 25 MG COMP PELL BT/30",
  },
  {
    name: "ATORVEX 10 MG COMP PELL FL/30",
  },
  {
    name: "ATORVEX 20 MG COMP PELL FL/30",
  },
  {
    name: "ATORVEX 40 MG COMP PELL FL/30",
  },
  {
    name: "CAPRIL COMP 25 MG BT/30",
  },
  {
    name: "CAPRIL 25 MG COMP BT/60",
  },
  {
    name: "CAPRIL COMP 50 MG BT/30",
  },
  {
    name: "CARDOX 1 MG COMP FL/30",
  },
  {
    name: "CARDOX 4 MG COMP FL/30",
  },
  {
    name: "CIPROLON 500 MG COMP.PELL BT/14",
  },
  {
    name: "CIPROLON 750 MG COMP. PELL B/14",
  },
  {
    name: "CIPTADINE COMP 4 MG BT/30",
  },
  {
    name: "DIABIREL COMP 1 MG BT/30",
  },
  {
    name: "DIABIREL COMP 2 MG BT/30",
  },
  {
    name: "DIABIREL COMP 3 MG BT/30",
  },
  {
    name: "DIABIREL COMP 4 MG BT/30",
  },
  {
    name: "DIARETYL 2 MG GELULE BT/10",
  },
  {
    name: "DIARETYL 2 MG GELULE BT/20",
  },
  {
    name: "FAMODINE 40 MG COMP.PELL BT/10",
  },
  {
    name: "FAMODINE COMP PELL 40 MG BT/30",
  },
  {
    name: "FAMODINE 20 MG COMP.PELL BT/30",
  },
  {
    name: "FENDOL 500 MG COMP.PELL  BT/20",
  },
  {
    name: "FLUCAND 150 MG GEL BT/1",
  },
  {
    name: "FLUCAND 150 MG GEL BT/2",
  },
  {
    name: "FLUCAND 150 MG GEL BT/4",
  },
  {
    name: "GELUFENE GEL. 200 MG BT/20",
  },
  {
    name: "HYPOTEN 25 MG COMP PELL BT/30",
  },
  {
    name: "HYPOTEN COMP PELL 100MG BT/30",
  },
  {
    name: "HYPOTEN COMP PELL 50MG BT/30",
  },
  {
    name: "ISOBAR COMP BT/30",
  },
  {
    name: "MOLSICOR 2 MG COMP SEC BT/30",
  },
  {
    name: "MOLSICOR 4 MG COMP BT/30",
  },
  {
    name: "NOOTROPYL 800 MG COMP PELL BT/45",
  },
  {
    name: "OPRAZOLE 10 MG COMP PELL  BT/14",
  },
  {
    name: "OPRAZOLE 20 MG COMP PELL  BT/14",
  },
  {
    name: "OPRAZOLE 20 MG COMP PELL  BT/28",
  },
  {
    name: "OPRAZOLE 20 MG COMP PELL  BT/7",
  },
  {
    name: "PARKIZOL COMP 5 MG BT/50",
  },
  {
    name: "PURINOL COMP 100 MG BT/30",
  },
  {
    name: "PURINOL COMP 300 MG BT/50",
  },
  {
    name: "RESTAMINE 10 MG COMP BT/20",
  },
  {
    name: "RHUMAGRIP COMP BT/20",
  },
  {
    name: "RONALIN 2.5 MG COMP  BT/30",
  },
  {
    name: "SIMVAX 20 MG comp pell BT/30",
  },
  {
    name: "SIMVAX 40 MG comp pell BT/30",
  },
  {
    name: "SOLOTIK 100 MG COMP PELL FL/15",
  },
  {
    name: "SOLOTIK 50 MG COMP PELL FL/15",
  },
  {
    name: "SOLOTIK 50 MG COMP PELL FL/30",
  },
  {
    name: "TAZIDINOL 20 MG  COMP PELL B/60",
  },
  {
    name: "TENSYNEL 10 MG GEL BT/30",
  },
  {
    name: "TENSYNEL 5 MG GEL BT/30",
  },
  {
    name: "TETRADOX 100 MG COMP  BT/10",
  },
  {
    name: "TETRADOX 200 MG COMP BT/10",
  },
  {
    name: "TRIFED PLUS COMP BT/20",
  },
  {
    name: "VOTREX 100 MG LP BT/10",
  },
  {
    name: "VOTREX 25 MG COMP PELL BT/30",
  },
  {
    name: "VOTREX 50 MG COMP PELL B/20",
  },
  {
    name: "XYLAR 250 COMP.PELL BT/14",
  },
  {
    name: "XYLAR 500 COMP.PELL BT/14",
  },
  {
    name: "ZOMAX 250 MG GELULE BT/6",
  },
  {
    name: "ZYRTEC COMP PELL  10 MG BT/15",
  },
  {
    name: "ATORVEX 10 MG COMP PELL FL/90",
  },
  {
    name: "ATORVEX 20 MG COMP PELL FL/90",
  },
  {
    name: "ATORVEX 40 MG COMP PELL FL/90",
  },
  {
    name: "TENSYNEL 5 MG GEL BT/90",
  },
  {
    name: "TENSYNEL 10 MG GEL BT/90",
  },
  {
    name: "BLOPRESS 8 MG Bt 30",
  },
  {
    name: "ZOMAX 500 mg COMP PELL BT/3",
  },
  {
    name: "BLOPRESS 16 mg COMP SEC BT/30",
  },
  {
    name: "INFLAGAM 200 MG COMP SEC B/20",
  },
  {
    name: "INFLACED 20 MG GEL B/15",
  },
  {
    name: "BLOPRESS 8 MG PLUS COMP SEC B/30",
  },
  {
    name: "BLOPRESS 16 MG PLUS COMP SEC B/30",
  },
  {
    name: "DIROXYL 6 MG COMP FL/30",
  },
  {
    name: "RICARDYL 200 MG BT/20",
  },
  {
    name: "SUPERSTAT 10 mg B/30",
  },
  {
    name: "SUPERSTAT 20 mg B/30",
  },
  {
    name: "CYCLADOL SUPPOSITOIRE B/10",
  },
  {
    name: "MOVEN GEL. 15mg BT/10",
  },
  {
    name: "MOVEN GEL. 7.5mg BT/10",
  },
  {
    name: "SUPERSTAT 10mg BT/90",
  },
  {
    name: "SUPERSTAT 20mg BT/90",
  },
  {
    name: "PURLEX 20mg BT/30",
  },
  {
    name: "PURLEX 10mg BT/30",
  },
  {
    name: "SUPERSTAT 5MG BT 30",
  },
  {
    name: "PREGAB 75mg GEL BT/30",
  },
  {
    name: "PREGAB 150mg GEL BT/60",
  },
  {
    name: "PREGAB 150 mg BT/30",
  },
  {
    name: "EPITAM 500mg BT60",
  },
  {
    name: "EPITAM 750mg BT60",
  },
  {
    name: "MOVEN GEL. 7.5mg BT/30",
  },
  {
    name: "EPITAM 250mg BT60",
  },
  {
    name: "Adenafil 50mg tab pack of 1",
  },
  {
    name: "Adenafil 50mg tab pack of 2",
  },
  {
    name: "Adenafil 50mg tab pack of 4",
  },
  {
    name: "Bonacor 2.5mg ",
  },
  {
    name: "Bonacor 5mg ",
  },
  {
    name: "Bonacor 10mg",
  },
  {
    name: "Zomax 200 mg/5ML susp 37.5ML",
  },
  {
    name: "lorinex 5mg tab Pack of 15",
  },
  {
    name: "lorinex 5mg tab Pack of 30",
  },
  {
    name: "Inflacox 200mg Tab pack of 10",
  },
  {
    name: "Inflacox 200mg Tab pack of 20",
  },
  {
    name: "Pranza 10mg tab pack of 30",
  },
  {
    name: "Pranza 5mg tab pack of 30",
  },
  {
    name: "PREGAB 75 14 CAP",
  },
  {
    name: "PROSPAN Sirop FL/100ml",
  },
  {
    name: "Nexus 20mg capsules (pack of 7)",
  },
  {
    name: "Nexus 20mg capsules (pack of 14)",
  },
  {
    name: "Nexus 40mg capsules (pack of 14)",
  },
  {
    name: "Nexus 40mg capsules (pack of 28)",
  },
  {
    name: "Unisia 8mg /5mg Tablets (Pack of 30)",
  },
  {
    name: "PURLEX 20mg COATED TABLET",
  },
  {
    name: "SITAVIA 100mg COATED TABLET",
  },
  {
    name: "ATORVEX 20 MG COATED TABLET",
  },
  {
    name: "FAMODINE 20  COATED TABLET",
  },
  {
    name: "SITAVIA PLUS COATED TABLET",
  },
  {
    name: "SOLOTIK 50 COATED TABLET",
  },
  {
    name: "ZOMAX 500 TABLET COATED",
  },
  {
    name: "EPITAM 500mg COATED TABLET",
  },
  {
    name: "EPITAM 750mg COATED TABLET",
  },
  {
    name: "ATORVEX 40 MG COATED TABLET",
  },
  {
    name: "OPRAZOLE 20 MG  COATED TABLET",
  },
  {
    name: "SOLOTIK 100 COATED TABLET",
  },
  {
    name: "HYPOTEN 50 MG COATED TABLET",
  },
  {
    name: "CIPROLON 750 MG  COATED TABLET",
  },
  {
    name: "ATARAX COATED TABLET",
  },
  {
    name: "FENDOL 500 COATED TABLET",
  },
  {
    name: "FAMODINE 40  COATED TABLET",
  },
  {
    name: "XYLAR 500 COATED TABLET",
  },
  {
    name: "PURLEX 10mg COATED TABLET",
  },
  {
    name: "HYPOTEN 100 MG COATED TABLET",
  },
  {
    name: "OPRAZOLE 10 MG COATED TABLET",
  },
  {
    name: "SIMVAX 40 COATED TABLET",
  },
  {
    name: "SIMVAX 20 COATED TABLET",
  },
  {
    name: "SUPERSTAT 20 mg COMP PELL",
  },
  {
    name: "EPITAM 250mg COATED TABLET",
  },
  {
    name: "SUPERSTAT 5MG COATED TABLET",
  },
  {
    name: "CIPROLON 500 MG  COATED TABLET",
  },
  {
    name: "NOOTROPYL COATED TABLET",
  },
  {
    name: "XYLAR 250 COATED TABLET",
  },
  {
    name: "ATORVEX 10 MG  COATED TABLET",
  },
  {
    name: "ZYRTEC COATED TABLET",
  },
  {
    name: "BONACOR 5 mg COATED TABLET",
  },
  {
    name: "ADENAFIL 50mg COATED TABLET",
  },
  {
    name: "BONACOR 10mg COATED TABLET",
  },
  {
    name: "LORINEX 5 mg COATED TABLET",
  },
  {
    name: "SUPERSTAT 10 mg COMP PELL",
  },
  {
    name: "BONACOR 2,5 mg COATED TABLET",
  },
  {
    name: "PREGAB 75 GELULE",
  },
  {
    name: "PREGAB 150 GELULE",
  },
  {
    name: "GELUFENE CAPSULE",
  },
  {
    name: "INFLACOX 200 mg GELULE",
  },
  {
    name: "NEXUS 20 mg GELULE",
  },
  {
    name: "MOVEN 7.5mg GELULE",
  },
  {
    name: "PREGAB 50mg GELULE",
  },
  {
    name: "NEXUS 40 mg GELULES",
  },
  {
    name: "MOVEN 15mg GELULE",
  },
  {
    name: "ZOMAX 250 CAPSULE",
  },
  {
    name: "DIARETYL  CAPSULE",
  },
  {
    name: "FLUCAND 150  CAPSULES",
  },
  {
    name: "GELUFENE CAPSULE",
  },
  {
    name: "PRANZA 5mg TABLET",
  },
  {
    name: "CAPRIL 50 MG  TABLET",
  },
  {
    name: "DIABIREL 1 MG TABLET",
  },
  {
    name: "ATORVEX 20 MG TABLET",
  },
  {
    name: "OPRAZOLE 10 MG TABLET",
  },
  {
    name: "CARDOX 4 MG TABLET",
  },
  {
    name: "SOLOTIK 100 TABLET",
  },
  {
    name: "ZYRTEC TABLET",
  },
  {
    name: "ZOMAX 500 TABLET",
  },
  {
    name: "EPITAM 750mg TABLET",
  },
  {
    name: "OPRAZOLE 20 MG  TABLET",
  },
  {
    name: "ATORVEX 40 MG TABLET",
  },
  {
    name: "CAPRIL 25 MG  TABLET",
  },
  {
    name: "SIMVAX 40 TABLET",
  },
  {
    name: "CARDOX 1 MG TABLET",
  },
  {
    name: "DOXAMYCINE 100 MG  TABLET",
  },
  {
    name: "ISOBAR TABLET",
  },
  {
    name: "CIPROLON  500 MG  TABLET",
  },
  {
    name: "CIPROLON  750 MG  TABLET",
  },
  {
    name: "NOOTROPYL TABLET",
  },
  {
    name: "CIPTADINE TABLET",
  },
  {
    name: "VITASCORBOL TABLET",
  },
  {
    name: "DIABIREL 4 MG TABLET",
  },
  {
    name: "XYLAR 500 TABLET",
  },
  {
    name: "ATARAX TABLET",
  },
  {
    name: "HYPOTEN 100 MG TABLET",
  },
  {
    name: "FAMODINE 20  TABLET",
  },
  {
    name: "FAMODINE 40  TABLET",
  },
  {
    name: "SUPERSTAT 5MG TABLET",
  },
  {
    name: "PURLEX 20mg TABLET",
  },
  {
    name: "RHUMAGRIP TABLET",
  },
  {
    name: "RONALIN TABLET",
  },
  {
    name: "PURINOL 300 TABLET",
  },
  {
    name: "SITAVIA PLUS TABLET",
  },
  {
    name: "SUPERSTAT 20 mg TABLET",
  },
  {
    name: "BLOPRESS 8 PLUS TABLET",
  },
  {
    name: "SUPERSTAT 10mg TABLET",
  },
  {
    name: "INFLAGAM 200 MG TABLET",
  },
  {
    name: "BLOPRESS 8 MG TABLET",
  },
  {
    name: "EPITAM 250 TABLET",
  },
  {
    name: "ATORVEX 10 MG TABLET",
  },
  {
    name: "DOXAMYCINE 200 MG  TABLET",
  },
  {
    name: "PARKIZOL TABLET",
  },
  {
    name: "SIMVAX 20 TABLET",
  },
  {
    name: "PURLEX 10mg TABLET",
  },
  {
    name: "PRANZA 10mg TABLET",
  },
  {
    name: "HYPOTEN 50 MG TABLET",
  },
  {
    name: "FENDOL 500 TABLET",
  },
  {
    name: "XYLAR 250 TABLET",
  },
  {
    name: "SOLOTIK 50 TABLET",
  },
  {
    name: "DIABIREL 2 MG TABLET",
  },
  {
    name: "DIABIREL 3 MG TABLET",
  },
  {
    name: "TRIFED PLUS TABLET",
  },
  {
    name: "BONACOR 10 mg TABLET",
  },
  {
    name: "BONACOR 5 mg TABLET",
  },
  {
    name: "BONACOR 2,5 TABLET",
  },
  {
    name: "ADENAFIL 50mg TABLET",
  },
  {
    name: "LORINEX 5 mg TABLET",
  },
  {
    name: "BLOPRESS 16 mg TABLET",
  },
  {
    name: "SITAVIA 100mg TABLET",
  },
  {
    name: "EPITAM 500mg TABLET",
  },
  {
    name: "PURINOL 100 TABLET",
  },
  {
    name: "BLOPRESS 16 PLUS TABLET",
  },
];
// Getting all
router.get("/:site", async (req, res) => {
  try {
    connection.query(
      "SELECT * FROM product where site='" + req.params.site + "'",
      function (error, rows) {
        res.json(rows);
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creating one
router.post("/", async (req, res) => {
  var name = req.body.name;
  var Category = 1;
  var site = req.body.site;
  try {
    var sql =
      "INSERT INTO `product` (`name`, `Category`, `site`) VALUES (?,?,?);";
    connection.query(sql, [name, Category, site], function (error, rows) {
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
    var sql = " UPDATE `product` SET `name` =?  WHERE (`id` = ?);";
    connection.query(sql, [name, req.params.id], function (error, rows) {
      if (error) return res.status(500).json({ message: error });
      res.json({ message: "updated product" });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", async (req, res) => {
  try {
    var sql = "DELETE FROM `product` WHERE (`id` = ?)";
    connection.query(sql, req.params.id, function (error, rows) {
      if (error) return res.status(500).json({ message: error });
      res.json({ message: "deleted product" });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
