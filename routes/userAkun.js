const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database/db");
const router = express.Router();

// Route untuk menampilkan form signup
router.get("/signup", (req, res) => {
  res.render("signup", {
    layout: "layouts/loginpage",
  });
});

router.get("/login", (req, res) => {
  res.render("login", {
    layout: "layouts/loginpage",
  });
});

// Route Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Error logging out");
    res.redirect("/login"); // Arahkan ke halaman login setelah logout
  });
});

module.exports = router;
