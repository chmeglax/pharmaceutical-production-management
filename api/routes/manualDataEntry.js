const express = require("express");
const router = express.Router();
const connection = require("./../../config/dbConfig");

// Getting with date
router.get("/:site/:start/:end/:equipmentSelect", async (req, res) => {
  try {
    sql =
      "SELECT       date,sum(break)+sum(PrevMaint)+sum(other) PlanDowntime,\
      sum(shiftDuration-1) totalWorkingTime,\
      sum(break) breakTime,    sum(Cleaning) cleaningTimeAndEndOfRun,    sum(Startup) startupTime,    sum(numberOfBreakdows) breakdownNumber, \
   sum(totalLackTIme)+sum(totalWaitingTime) breakdownsTime,    sum(totalWaitingTime) totalWaitingTime,\
   sum(Adjustments) totalAdjustmentTime,    sum(QvmInterv) qvmInterventionTime,    sum(totalLackTIme) totalLackTIme,\
   sum(shiftDuration)-sum(break)-sum(Cleaning)-sum(Startup) totalRunTime,\
   sum(plannedQty) plannedQty,\
   sum(producedQty) producedQty,    sum(scarp) scarp,    sum(rework) rework ,\
   (sum(producedQty)/sum(plannedQty))*100 productionOutput,    (((sum(totalLackTIme)+sum(totalWaitingTime))/sum(break)))*100 failureRate, \
   ((sum(shiftDuration)-sum(totalLackTIme)-sum(totalWaitingTime))/sum(break))*100 availibilty, \
(sum(producedQty)/((sum(shiftDuration)-sum(totalLackTIme)-sum(totalWaitingTime))*avg(speed)))*100 performance ,\
   ((sum(scarp)+sum(rework))/sum(producedQty))*100 quality\
      FROM hikma.dataentry \
        where date between '" +
      req.params.start +
      "' and '" +
      req.params.end +
      "' and site_id='" +
      req.params.site +
      "' and equipment_id='" +
      req.params.equipmentSelect +
      "' \
        group by date";

    connection.query(sql, function (error, rows) {
      rows.forEach((element) => {
        element.oee =
          element.quality * element.performance * element.availibilty;
      });

      res.json(rows);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Getting all
router.get("/:site", async (req, res) => {
  try {
    sql =
      "SELECT       id,date,break+PrevMaint+other PlanDowntime,\
    shiftDuration-1 totalWorkingTime,\
    break breakTime,    Cleaning cleaningTimeAndEndOfRun,    Startup startupTime,    numberOfBreakdows breakdownNumber, \
 totalLackTIme+totalWaitingTime breakdownsTime,    totalWaitingTime totalWaitingTime,\
 Adjustments totalAdjustmentTime,    QvmInterv qvmInterventionTime,    totalLackTIme totalLackTIme,\
 shiftDuration-break-Cleaning-Startup totalRunTime,\
 plannedQty plannedQty,\
 producedQty producedQty,    scarp scarp,    rework rework ,\
 (producedQty/plannedQty)*100 productionOutput,    (((totalLackTIme+totalWaitingTime)/break))*100 failureRate, \
 ((shiftDuration-totalLackTIme-totalWaitingTime)/break)*100 availibilty, \
(producedQty/((shiftDuration-totalLackTIme-totalWaitingTime)*speed))*100 performance ,\
 ((scarp+rework)/producedQty)*100 quality \
    from dataEntry where site_id='" +
      req.params.site +
      "'";
    connection.query(sql, function (error, rows) {
      res.json(rows);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
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
    req.body.appliedSpeed,
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
    req.body.site,
    // `product_id`,
    req.body.productSelect,
    // `parc_id`,
    "1",
    // `equipment_id`) \
    req.body.equipmentSelect,
    //`validatedSpeed`,
    req.body.validatedSpeed,
    //`maximumSpeed `
    req.body.maximalSpeed,
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
         `MaintInterv`, `LackElectr`, `LackAir`, `LackWater`, `startTime`, `shiftDuration`, `site_id`, `product_id`, `parc_id`, `equipment_id`, `validatedSpeed`, `maximumSpeed`, `totalWaitingTime`, `totalLackTIme` ) \
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
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
    var sql = "DELETE FROM `user` WHERE (`id` = ?)";
    connection.query(sql, req.params.id, function (error, rows) {
      if (error) return res.status(500).json({ message: error });
      res.json({ message: "deleted user" });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
/*
SELECT PlanDowntime,
shiftDuration-1,
break,
Cleaning,
Startup,
numberOfBreakdows,
totalLackTIme+totalWaitingTime,
totalWaitingTime,
Adjustments,
QvmInterv,
totalLackTIme,
shiftDuration-totalLackTIme-totalWaitingTime runtime,
plannedQty,
producedQty,
scarp,
rework,
producedQty/plannedQty*100 performanceReport,
(totalLackTIme+totalWaitingTime)/break*100 failureRate,
((shiftDuration-totalLackTIme-totalWaitingTime)/break)*100 availibilty,
(producedQty/((shiftDuration-totalLackTIme-totalWaitingTime)*speed))*100 performance ,
((scarp+rework)/producedQty)*100 quality FROM hikma.dataentry;*/
function durationCal(s, e) {
  var timeStart = new Date("01/01/2007 " + s);
  var timeEnd = new Date("01/01/2007 " + e);
  var difference = timeEnd - timeStart;

  difference = difference = difference / 60 / 1000;
  if (difference < 0) difference = 24 * 60 + difference;
  return difference;
}
