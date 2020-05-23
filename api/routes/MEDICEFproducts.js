const express = require("express");
const router = express.Router();
const products = require("../models/MEDICEFproduct");
function formatDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "-" + mm + "-" + yyyy;

  return today;
}

// Getting all
router.get("/", async (req, res) => {
  var productss;
  try {
    // products.insertMany(doc);
    productss = await products.find();
    res.json(productss);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One
router.get("/:id", getproducts, (req, res) => {
  res.json(res.products);
});

// Creating one
router.post("/", async (req, res) => {
  const user = new products({
    name: req.body.name,
  });
  try {
    const newproducts = await user.save();
    res.redirect("/");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch("/:id", getproducts, async (req, res) => {
  if (req.body.name != null) {
    res.products.name = req.body.name;
  }
  try {
    const updatedproducts = await res.products.save();
    res.json(updatedproducts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", getproducts, async (req, res) => {
  try {
    await res.products.remove();
    res.json({ message: "Deleted products" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getproducts(req, res, next) {
  let product;
  try {
    product = await products.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "Cannot find products" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.products = product;
  next();
}

module.exports = router;
