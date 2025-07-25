const express = require("express");
const path = require("path");
require("dotenv").config();
const { marked } = require("marked");
const sanitizeHtml = require("sanitize-html");

// your AI orchestrator (stub for now)
const { generateItinerary } = require("./services/geminiAgent");

const app = express();
const PORT = process.env.PORT || 3000;

// ------- View Engine / Static Setup -------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// --- Routes ---
app.get("/", (req, res) => res.redirect("/plan-trip"));
app.get("/plan-trip", (req, res) => {
  res.render("index.ejs");
});

// Receive form data, invoke AI, return itinerary
app.post("/api/plan", async (req, res) => {
  try {
    const {
      source,
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      interests: interestsCsv,
    } = req.body;

    // Parse interests into an array
    const interests = interestsCsv
      ? interestsCsv
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean)
      : [];

    // Build tripData payload
    const tripData = {
      source,
      destination,
      startDate,
      endDate,
      budget: Number(budget),
      travelers: Number(travelers),
      interests,
    };

    // Call your Gemini agent
    const markdown = await generateItinerary(tripData);
    const itineraryHTML = marked.parse(markdown); //Converts Markdown to HTML.
    const safeHTML = sanitizeHtml(itineraryHTML); //Gemini may return malicious HTML sanitize-html strips unsafe tags and attributes
    res.render("itinerary", { itinerary: safeHTML });
  } catch (err) {
    console.error("Error generating itinerary:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to generate itinerary." });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`✅ TripSage server running at http://localhost:${PORT}`);
});
