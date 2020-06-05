const express = require("express");
const router = express.Router();
const connection = require("./../../config/dbConfig");

// Getting with date
router.get("/:site/:start/:end", async (req, res) => {
  try {
    sql =
      "SELECT  date,sum(plannedQty) plan,\
      sum(producedQty) prod\
      FROM hikma.dataentry \
        where date between '" +
      req.params.start +
      "' and '" +
      req.params.end +
      "' and site_id='" +
      req.params.site +
      "' group by date";

    connection.query(sql, function (error, rows) {
      res.json(rows);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

module.exports = router;
