const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
// const todoRoutes = require("./routes/tododb.js");
require("dotenv").config();
const port = process.env.PORT;
const db = require("./database/db");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const userAkun = require("./routes/userAkun");
const mobileLegendDb = require("./routes/mobileLegenddb");

app.use(expressLayouts);
app.use(express.json());
app.use(bodyParser.json());
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
app.use("/api/mobile-legend", mobileLegendDb);

app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layout",
  });
});

app.get("/mobile-legend", (req, res) => {
  res.render("mobile-legend", {
    layout: "layouts/main-layout",
  });
});

app.get("/valorant", (req, res) => {
  res.render("valorant", {
    layout: "layouts/main-layout",
  });
});

app.get("/honor-of-kings", (req, res) => {
  res.render("honor-king", {
    layout: "layouts/main-layout",
  });
});

app.get("/efootball", (req, res) => {
  res.render("eFootball", {
    layout: "layouts/main-layout",
  });
});

app.get("/pubg", (req, res) => {
  res.render("pubg", {
    layout: "layouts/main-layout",
  });
});

app.get("/deltaf", (req, res) => {
  res.render("deltaf", {
    layout: "layouts/main-layout",
  });
});

app.get("/stumble-guys", (req, res) => {
  res.render("stumble-guys", {
    layout: "layouts/main-layout",
  });
});

app.get("/marvel-duel", (req, res) => {
  res.render("marvel-duel", {
    layout: "layouts/main-layout",
  });
});

app.get("/epep", (req, res) => {
  res.render("epep", {
    layout: "layouts/main-layout",
  });
});

app.get("/age-empire", (req, res) => {
  res.render("age-empire", {
    layout: "layouts/main-layout",
  });
});

app.get("/pb", (req, res) => {
  res.render("pb", {
    layout: "layouts/main-layout",
  });
});

app.get("/magic-chess", (req, res) => {
  res.render("magic-chess", {
    layout: "layouts/main-layout",
  });
});

app.get("/metal-slug", (req, res) => {
  res.render("metal-slug", {
    layout: "layouts/main-layout",
  });
});


app.get("/CekTransaksi", (req, res) => {
  res.render("cekTransaksi", {
    layout: "layouts/main-layout",
  });
});

app.get("/leaderboard", (req, res) => {
  res.render("leaderboard", {
    layout: "layouts/main-layout",
  });
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
