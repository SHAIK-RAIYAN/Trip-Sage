const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- App & View Engine Setup ----------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Base Route
app.get("/", (req, res) => res.redirect("/plan-trip"));
app.get("/plan-trip", (req, res) => {
  res.render("index.ejs");
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ TripSage server running at http://localhost:${PORT}`);
});
