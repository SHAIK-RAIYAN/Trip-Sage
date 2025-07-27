const express = require("express");
const path = require("path");
require("dotenv").config();
const { marked } = require("marked");
const sanitizeHtml = require("sanitize-html");
const http = require("http"); //required for socket.io
const { Server } = require("socket.io");

// your AI orchestrator (stub for now)
const { generateItinerary } = require("./services/geminiAgent");
const { fetchBestFlights } = require("./services/flightService");
const { startPersistentChat } = require("./services/chatService");
const getAirportData = require("./utils/getAirportData");

const app = express();
const PORT = process.env.PORT || 3000;

// ------- Express-session -------
const session = require("express-session");
app.use(
  session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }, // session lasts 10 minutes
  })
);

// ------- socket.io Setup -------
// socket.io - A toolkit that lets your server and the user’s browser talk “live,” back and forth.
// Socket.IO keeps a channel open so you can push messages immediately when they’re ready. Like being on a phone call instead of sending letters

const server = http.createServer(app); //wraps your web routes in a low‑level server - sets up the call line
const io = new Server(server); //attaches Socket.IO so it can handle live connections

// Socket.IO chat namespace

io.of("/chat").on("connection", (socket) => {
  console.log("🔌 Chat client connected:", socket.id);
  // Listen for user messages
  let chatSession = null; // This will hold the stateful chat session for this connection
  socket.on("userMessage", async ({ question, context }) => {
    try {
      // On the first message, initialize the chat session with the priming history.
      if (!chatSession) {
        // The context from the client includes the initial trip details.
        // We only need the history *before* the user's first question for initialization.
        const initialHistory = context.slice(0, -1);
        chatSession = await startPersistentChat(initialHistory);
      }

      // For the first and all subsequent messages, send the user's question to the chat.
      const result = await chatSession.sendMessage(question); // The session now correctly maintains the history.
      const response = await result.response;
      const answer = response.text();

      socket.emit("agentMessage", { answer });
    } catch (err) {
      console.error("Chat error:", err);
      socket.emit("agentMessage", {
        answer: "Sorry, I hit an error. Please try again.",
      });
    }
  });
});

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

    //Store data in session
    req.session.tripData = tripDataItinerary;
    req.session.itineraryMarkdown = markdown;

    // Render the view
    res.render("itinerary", {
      itinerary: safeItinerary,
      flights,
      tripData: tripDataItinerary,
      itineraryMarkdown: markdown,
    });
  } catch (err) {
    console.error("TripSage error:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`✅ TripSage server running at http://localhost:${PORT}`);
});
