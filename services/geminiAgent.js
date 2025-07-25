const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.generateItinerary = async function (tripData) {
  const prompt = `
You're a professional travel agent AI assistant.

Create a **professionally formatted** and **structured** day-wise travel itinerary in **Markdown syntax**.

Requirements:
- Use **headings** for each day (e.g., ## Day 1 (01-04-2026)- Arrival)
- Use **bold text** for time blocks (e.g., **Morning**, **Afternoon**, **Evening**)
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

Each day should have a heading (e.g., ## Day 1), followed by bullet points or paragraphs for activities, local experiences, meals, important notes and travel tips. Keep it organized and easy to read.
Respond only in Markdown. Do not include frontmatter or explanations.
`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const itineraryText = response.text(); //Gemini returns Markdown

  return itineraryText;
};
