const express = require("express");
const router = express.Router();
const connection = require("./../../config/dbConfig");

// Getting all
router.get("/", async (req, res) => {
  try {
    connection.query(
      "select u.id,u.name,u.email,u.access,u.position,u.phone,u.state,u.site_id,u.department as 'dep_id' ,d.name as department,s.name as site\
      from user u\
      inner join department d on d.id = u.department\
      inner join site s on s.id = u.site_id;",
      function (error, rows) {
        res.json(rows);
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
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
