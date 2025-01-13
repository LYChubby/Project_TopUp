const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.get("/", (req, res) => {
  const query = "SELECT * FROM valorant";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/tambah", (req, res) => {
  const { vp, harga } = req.body;
  const query = "INSERT INTO valorant (vp, harga) VALUES (?, ?)";
  db.query(query, [vp, harga], (err, result) => {
    if (err) throw err;
    res.json({ message: "Data added successfully", id: result.insertId });
  });
});

router.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { vp, harga } = req.body;
  const query = "UPDATE valorant SET vp = ?, harga = ? WHERE id = ?";
  db.query(query, [vp, harga, id], (err) => {
    if (err) {
      console.error("Error updating card:", err);
      return res.status(500).json({ message: "Error updating card" });
    }
    res.json({ message: "Data updated successfully" });
  });
});

router.get("/data/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM valorant WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.json(results[0]);
  });
});

router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM valorant WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err) throw err;
    res.json({ message: "Data deleted successfully" });
  });
});

module.exports = router;
