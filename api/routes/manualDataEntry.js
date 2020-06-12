const express = require("express");
const router = express.Router();
const connection = require("./../../config/dbConfig");
const moment = require("moment");

// Creating one
router.post("/", async (req, res) => {
  totalWaitingTime =
    Number(req.body.wMaterials) +
    Number(req.body.wOperators) +
    Number(req.body.wQuality) +
    Number(req.body.wQuality) +
    Number(req.body.wQVM) +
    Number(req.body.wMaint) +
    Number(req.body.QVMIntervention);
  totalLackTIme =
    Number(req.body.lackOfElectricity) +
    Number(req.body.lackOfAir) +
    Number(req.body.lackOFWater);
  var shiftDuration = durationCal(req.body.shiftStart, req.body.shiftEnd);
  data = [
    req.body.operatorID,
    req.body.plannedQty,
    req.body.producedQty,
    "11", //rework
    req.body.scarp,
    req.body.validatedSpeed,
    req.body.numberOfBreakdowns,
    //date
    req.body.date,
    //comment
    "comment",
    req.body.break,
    req.body.plannedDownTime,
    //`PrevMaint`,
    req.body.PreventiveMaint,
    //`other`,
    req.body.otherPlannedDownTime,
    //`Cleaning`,
    req.body.CleaningAndEndOfRun,
    //`QAValidation`,
    req.body.QualityValidation,
    // `Startup`,
    req.body.startup,
    // `Adjustments`,
    req.body.adjustments,
    //`WaitMaterials`,
    req.body.wMaterials,
    //`Waitperators`,
    req.body.wOperators,
    //`WaitQuality`,
    req.body.wQuality,
    //`WaitQVM`,
    req.body.wQVM,
    //`WaitMaint`,
    req.body.wMaint,
    //`QvmInterv`,
    req.body.QVMIntervention,
    //`MaintInterv`,
    req.body.maintIntervention,
    //`LackElectr`,
    req.body.lackOfElectricity,
    //`LackAir`,
    req.body.lackOfAir,
    // `LackWater`,
    req.body.lackOFWater,
    //`startTime`,
    req.body.shiftStart,
    //`shiftDuration`,
    shiftDuration,
    //`site_id`,
    req.body.shiftType,
    req.body.site,
    // `product_id`,
    req.body.productSelect,
    // `parc_id`,
    "1",
    // `equipment_id`) \
    req.body.equipmentSelect,

    totalWaitingTime,
    totalLackTIme,
  ];

  var re = data.map(function (obj) {
    if (obj == "") obj = "0";

    return obj;
  });

  try {
    var sql =
      "INSERT INTO `hikma`.`dataentry` (`operateur`, `plannedQty`, `producedQty`, `rework`, `scarp`, `speed`, `numberOfBreakdows`, `date`, `comment`, `break`, `PlanDowntime`,\
         `PrevMaint`, `other`, `Cleaning`, `qualityValidation`, `Startup`, `Adjustments`, `WaitMaterials`, `Waitperators`, `WaitQuality`, `WaitQVM`, `WaitMaint`, `QvmInterv`, \
         `MaintInterv`, `LackElectr`, `LackAir`, `LackWater`, `startTime`, `shiftDuration`, `shiftType`, `site_id`, `product_id`, `parc_id`, `equipment_id`, `totalWaitingTime`, `totalLackTIme` ) \
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
    connection.query(sql, re, function (error, rows) {
      if (error) {
        console.log(error);
        req.flash("error", "Error");
      } else {
        req.flash("info", "Data added successfully !");
      }
      //res.json({ message: "added data" });

      res.redirect("/manueldata");
    });
  } catch (err) {
    req.flash("error", "Error");
    res.redirect("/manueldata");
  }
});
// Updating One
router.patch("/:id", async (req, res) => {
  try {
    var name = req.body.name;
    var email = req.body.email;
    var department = req.body.department;
    var phone = req.body.phone;
    var site = req.body.access.site;
    var access = req.body.access.type;
    var phone = req.body.phone;

    var sql =
      " UPDATE `user` SET `name` =? ,\
    `email` = ?,`phone`=?, `department` = ?, `site_id` = ?,\
     `access` = ? WHERE (`id` = ?);";
    connection.query(
      sql,
      [name, email, phone, department, site, access, req.params.id],
      function (error, rows) {
        if (error) return res.status(500).json({ message: error });
        res.json({ message: "updated user" });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", async (req, res) => {
  try {
    var sql = "DELETE FROM `dataentry` WHERE (`id` = ?)";
    connection.query(sql, req.params.id, function (error, rows) {
      if (error) return res.status(500).json({ message: error });
      res.json({ message: "deleted user" });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

function durationCal(s, e) {
  var timeStart = new Date("01/01/2007 " + s);
  var timeEnd = new Date("01/01/2007 " + e);
  var difference = timeEnd - timeStart;

  difference = difference = difference / 60 / 1000;
  if (difference < 0) difference = 24 * 60 + difference;
  return difference;
}
