const express = require("express");
const path = require("path");
require("dotenv").config();
const { marked } = require("marked");
const sanitizeHtml = require("sanitize-html");

// your AI orchestrator (stub for now)
const { generateItinerary } = require("./services/geminiAgent");
const { fetchBestFlights } = require("./services/flightService");
const getAirportData = require("./utils/getAirportData");

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
      includeTransport, //include flight details
    } = req.body;

    // Parse interests into an array
    const interests = interestsCsv
      ? interestsCsv
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean)
      : [];

    // Spell‑correct & resolve airport data
    const srcData = getAirportData(source);
    const dstData = getAirportData(destination);

    if (!srcData || !dstData) {
      return res
        .status(400)
        .send(
          "Unable to resolve your source/destination. Please check spelling."
        );
    }

    // Build two separate payloads
    const tripDataItinerary = {
      source: srcData.city,
      destination: dstData.city,
      startDate,
      endDate,
      budget: Number(budget),
      travelers: Number(travelers),
      interests,
    };

    const tripDataFlights = {
      source: srcData.iata,
      destination: dstData.iata,
      startDate,
      endDate,
    };

    //fetch flights
    let flights = [];
    if (includeTransport === "on") {
      flights = await fetchBestFlights(tripDataFlights);
    }

    // Call your Gemini agent - Generate itinerary markdown
    const markdown = await generateItinerary(tripDataItinerary);
    const htmlItinerary = marked.parse(markdown); //Converts Markdown to HTML.
    const safeItinerary = sanitizeHtml(htmlItinerary); //Gemini may return malicious HTML sanitize-html strips unsafe tags and attributes
    // Render the view
    res.render("itinerary", { itinerary: safeItinerary, flights });
  } catch (err) {
    console.error("TripSage error:", err);
    return res
      .status(500)
      .send("Internal Server Error");
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`✅ TripSage server running at http://localhost:${PORT}`);
});
