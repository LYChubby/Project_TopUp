const express = require("express");
const router = express.Router();
const db = require("../database/db"); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua data top-up
router.get("/", (req, res) => {
  db.query("SELECT * FROM mobile_legend", (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.json(results);
  });
});

// Endpoint untuk mendapatkan data top-up berdasarkan ID
router.get("/data/:id", (req, res) => {
  db.query("SELECT * FROM mobile_legend WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    if (results.length === 0) return res.status(404).send("Data tidak ditemukan");
    res.json(results[0]);
  });
});

// Endpoint untuk menambahkan data top-up baru
router.post("/tambah", (req, res) => {
  const { name, price, type, image_url } = req.body;

  if (!name || !price || !type || !image_url) {
    return res.status(400).send("Semua kolom wajib diisi");
  }

  db.query("INSERT INTO mobile_legend (name, price, type, image_url) VALUES (?, ?, ?, ?)", [name.trim(), price, type, image_url.trim()], (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    const newItem = {
      id: results.insertId,
      name: name.trim(),
      price,
      type,
      image_url: image_url.trim(),
    };
    res.status(201).json(newItem);
  });
});

// Endpoint untuk memperbarui data top-up
router.put("/update/:id", (req, res) => {
  const { name, price, type, image_url } = req.body;

  db.query("UPDATE mobile_legend SET name = ?, price = ?, type = ?, image_url = ? WHERE id = ?", [name, price, type, image_url, req.params.id], (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    if (results.affectedRows === 0) return res.status(404).send("Data tidak ditemukan");
    res.json({ id: req.params.id, name, price, type, image_url });
  });
});

// Endpoint untuk menghapus data top-up
router.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM mobile_legend WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    if (results.affectedRows === 0) return res.status(404).send("Data tidak ditemukan");
    res.status(204).send();
  });
});

module.exports = router;
