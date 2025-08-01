const { GoogleGenerativeAI } = require("@google/generative-ai");
const ExpressError = require("../utils/ExpressError");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

exports.generateItinerary = async function (tripData) {
  const prompt = `
You're a professional travel agent AI assistant.

Create a **professionally formatted** and **structured** day-wise travel itinerary in **Markdown syntax**.

Requirements:
- The journey begins at the user's **source city** on the **start date**.
- The user **travels to the destination** on the start date.
- The trip includes daily activities at the **destination**.
- On the **end date**, the user **returns back to the source**.
- Use **headings** for each day in bold (e.g., ## Day 1 (01-04-2026) - Arrival)
- Use **bold text** for Days and time blocks (e.g., **Day 1 (28-07-2025) - Arrival in Bangalore**, **Morning**, **Afternoon**, **Evening**)
- Add **newlines between day and time blocks**
- Use **bullet points** under each time block
- Add spacing between sections for readability

Trip Details:
- Source: ${tripData.source}
- Destination: ${tripData.destination}
- Dates: ${tripData.startDate} to ${tripData.endDate}
- Budget: ₹${tripData.budget}
- Travelers: ${tripData.travelers}
- Interests: ${tripData.interests.join(", ")}

Each day should have a heading, followed by bullet points or paragraphs for activities, local experiences, meals, important notes and travel tips. Keep it organized and easy to read.
Respond only in Markdown. Do not include frontmatter or explanations.
`;

  let result;
  try {
    result = await model.generateContent(prompt);
  } catch (err) {
    throw new ExpressError(
      "Unable to generate itinerary at this time. Please try again later.",
      502,
      "ITINERARY_API_ERROR"
    );
  }

  const text = result.response?.text();
  if (!text || text.length < 20) {
    throw new ExpressError(
      "Received an unexpected response from the AI service.",
      502,
      "ITINERARY_INVALID_RESPONSE"
    );
  }

  return text;
};
