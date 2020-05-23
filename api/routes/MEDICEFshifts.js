const express = require("express");
const router = express.Router();
const shifts = require("../models/MEDICEFshifts");

// Getting all
router.get("/", async (req, res) => {
  var shiftss;
  try {
    // products.insertMany(doc);
    shiftss = await shifts.findOne().sort({ _id: -1 });
    res.json(shiftss);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Creating one
router.post("/", async (req, res) => {
  var data = {
    number: req.body.number,
    first: {
      start: req.body.shift1Start,
      end: req.body.shift1End,
    },
  };

  if (req.body.number >= 2) {
    data.second = { start: req.body.shift2Start, end: req.body.shift2End };
  }

  if (req.body.number == 3) {
    data.third = { start: req.body.shift3Start, end: req.body.shift3End };
  }
  const user = new shifts(data);
  try {
    const newshifts = await user.save();
    res.redirect("/shifts");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
