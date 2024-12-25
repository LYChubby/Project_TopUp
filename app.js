const express = require("express");
const path = require("path");
const app = express();
// const todoRoutes = require("./routes/tododb.js");
require("dotenv").config();
const port = process.env.PORT;
const db = require("./database/db");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const userAkun = require("./routes/userAkun");

app.use(expressLayouts);
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key", // Gunakan secret key yang aman
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set ke true jika menggunakan HTTPS
  })
);

app.use("/", userAkun);

app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layout",
  });
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
