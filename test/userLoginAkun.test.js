const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database/db");

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error accessing database",
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error comparing passwords",
        });
      }
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Login successful",
      });
    });
  });
});

module.exports = router;
